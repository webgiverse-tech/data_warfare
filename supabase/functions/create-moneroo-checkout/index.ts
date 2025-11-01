import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Moneroo Checkout Edge Function invoked.'); // Added log at the very beginning
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request received.'); // Added log for preflight
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
      console.error('Unauthorized access or user not found:', userError?.message || 'No user session.'); // More specific error log
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('User authenticated:', user.id); // Log user ID

    const requestBody = await req.json(); // This line might fail if the request body is not valid JSON
    const { planId } = requestBody;

    console.log('Received planId:', planId); // Log the received planId

    if (!planId) {
      console.error('Missing planId in request body.'); // Log if planId is missing
      return new Response(JSON.stringify({ error: 'Missing planId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let amount: number;
    const currency = "XOF";

    switch (planId) {
      case 'pro':
        amount = parseInt(Deno.env.get('MONEROO_PRO_AMOUNT_XOF') || '0');
        console.log('Plan Pro selected, amount:', amount); // Log selected plan and amount
        if (amount === 0) throw new Error('MONEROO_PRO_AMOUNT_XOF not set or invalid.');
        break;
      case 'elite':
        amount = parseInt(Deno.env.get('MONEROO_ELITE_AMOUNT_XOF') || '0');
        console.log('Plan Elite selected, amount:', amount); // Log selected plan and amount
        if (amount === 0) throw new Error('MONEROO_ELITE_AMOUNT_XOF not set or invalid.');
        break;
      default:
        console.error('Invalid planId received:', planId); // Log if planId is invalid
        return new Response(JSON.stringify({ error: 'Invalid planId' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const MONEROO_API_KEY = Deno.env.get('MONEROO_API_KEY');
    console.log('MONEROO_API_KEY status:', MONEROO_API_KEY ? 'set' : 'not set'); // Check if API key is loaded
    if (!MONEROO_API_KEY) {
      throw new Error('MONEROO_API_KEY is not set in environment variables.');
    }

    const successUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/dashboard?moneroo_success=true`;
    const cancelUrl = `${req.headers.get('referer') || Deno.env.get('SUPABASE_URL')}/pricing?moneroo_canceled=true`;
    console.log('Moneroo redirect URLs:', { successUrl, cancelUrl }); // Log redirect URLs

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
          name: user.user_metadata.full_name || user.email,
        },
        payment_method: "mobile_money",
        redirect_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: user.id,
          plan_id: planId,
        },
      }),
    });

    console.log('Moneroo API response status:', monerooResponse.status); // Log Moneroo API response status

    if (!monerooResponse.ok) {
      const errorData = await monerooResponse.json();
      console.error('Moneroo API error response:', errorData); // Log detailed error from Moneroo
      return new Response(JSON.stringify({ error: errorData.message || 'Failed to create payment session with Moneroo.' }), {
        status: monerooResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { checkout_url } = await monerooResponse.json();
    console.log('Moneroo checkout_url received:', checkout_url); // Log the received checkout URL

    return new Response(JSON.stringify({ checkout_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Edge Function caught an error in try block:', error.message); // Log any unexpected errors
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});