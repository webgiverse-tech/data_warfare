import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Edge Function create-lygosapp-checkout invoked.'); // Added log

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request.'); // Added log
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

    console.log('Supabase client created. Attempting to get user session.'); // Added log
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error('Error getting user from session:', userError.message); // Added log
      return new Response(JSON.stringify({ error: 'Authentication error' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
      console.warn('No authenticated user found.'); // Added log
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`User authenticated: ${user.id}`); // Added log

    const { price_id } = await req.json();
    console.log(`Received price_id: ${price_id}`); // Added log

    if (!price_id) {
      console.warn('Missing price_id in request body.'); // Added log
      return new Response(JSON.stringify({ error: 'Missing price_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LYGOSAPP_API_KEY = Deno.env.get('LYGOSAPP_API_KEY');
    if (!LYGOSAPP_API_KEY) {
      console.error('LYGOSAPP_API_KEY is not set in environment variables.'); // Added log
      throw new Error('Lygosapp API Key not set in environment variables.');
    }
    console.log('LYGOSAPP_API_KEY is set.'); // Added log

    const successUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/dashboard?success=true`;
    const cancelUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/pricing?canceled=true`;
    console.log(`Success URL: ${successUrl}, Cancel URL: ${cancelUrl}`); // Added log

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
    console.log(`Lygosapp API response status: ${lygosappResponse.status}`); // Added log

    if (!lygosappResponse.ok) {
      const errorData = await lygosappResponse.json();
      console.error('Lygosapp API error:', errorData);
      return new Response(JSON.stringify({ error: errorData.message || 'Failed to create checkout session with Lygosapp.' }), {
        status: lygosappResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { checkout_url } = await lygosappResponse.json();
    console.log(`Lygosapp checkout URL received: ${checkout_url}`); // Added log

    return new Response(JSON.stringify({ checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Edge Function caught an error:', error.message); // Modified log
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});