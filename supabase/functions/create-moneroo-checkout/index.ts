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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { planId } = await req.json();

    if (!planId) {
      return new Response(JSON.stringify({ error: 'Missing planId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let amount: number;
    const currency = "XOF"; // Assuming XOF for Benin

    switch (planId) {
      case 'pro':
        amount = parseInt(Deno.env.get('MONEROO_PRO_AMOUNT_XOF') || '0');
        if (amount === 0) throw new Error('MONEROO_PRO_AMOUNT_XOF not set or invalid.');
        break;
      case 'elite':
        amount = parseInt(Deno.env.get('MONEROO_ELITE_AMOUNT_XOF') || '0');
        if (amount === 0) throw new Error('MONEROO_ELITE_AMOUNT_XOF not set or invalid.');
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid planId' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const MONEROO_API_KEY = Deno.env.get('MONEROO_API_KEY');
    if (!MONEROO_API_KEY) {
      throw new Error('MONEROO_API_KEY is not set in environment variables.');
    }

    const successUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/dashboard?moneroo_success=true`;
    const cancelUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/pricing?moneroo_canceled=true`;

    const monerooResponse = await fetch('https://api.moneroo.io/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MONEROO_API_KEY}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        customer: {
          email: user.email,
          name: user.user_metadata.full_name || user.email, // Use full_name if available, otherwise email
        },
        payment_method: "mobile_money", // Default to mobile_money, can be made dynamic if needed
        redirect_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: user.id,
          plan_id: planId,
        },
      }),
    });

    if (!monerooResponse.ok) {
      const errorData = await monerooResponse.json();
      console.error('Moneroo API error:', errorData);
      return new Response(JSON.stringify({ error: errorData.message || 'Failed to create payment session with Moneroo.' }), {
        status: monerooResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { checkout_url } = await monerooResponse.json();

    return new Response(JSON.stringify({ checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Edge Function caught an error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});