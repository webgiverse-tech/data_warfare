import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { price_id } = await req.json();

    if (!price_id) {
      return new Response(JSON.stringify({ error: 'Missing price_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LYGOSAPP_API_KEY = Deno.env.get('LYGOSAPP_API_KEY');
    if (!LYGOSAPP_API_KEY) {
      throw new Error('Lygosapp API Key not set in environment variables.');
    }

    const successUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/dashboard?success=true`;
    const cancelUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/pricing?canceled=true`;

    const lygosappResponse = await fetch('https://api.lygosapp.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LYGOSAPP_API_KEY}`,
      },
      body: JSON.stringify({
        price_id: price_id,
        customer_email: user.email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: user.id, // Pass user ID for webhook processing
        },
      }),
    });

    if (!lygosappResponse.ok) {
      const errorData = await lygosappResponse.json();
      console.error('Lygosapp API error:', errorData);
      return new Response(JSON.stringify({ error: errorData.message || 'Failed to create checkout session with Lygosapp.' }), {
        status: lygosappResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { checkout_url } = await lygosappResponse.json();

    return new Response(JSON.stringify({ checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Edge Function error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});