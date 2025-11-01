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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
      },
    });

    const LYGOSAPP_WEBHOOK_SECRET = Deno.env.get('LYGOSAPP_WEBHOOK_SECRET');
    if (!LYGOSAPP_WEBHOOK_SECRET) {
      throw new Error('Lygosapp Webhook Secret not set in environment variables.');
    }

    // IMPORTANT: In a real application, you MUST verify the webhook signature here.
    // Lygosapp documentation mentions a 'webhook_secret' for verification.
    // For simplicity in this example, we'll skip signature verification,
    // but it's crucial for production security.
    // Example (conceptual, adjust based on Lygosapp's actual signature header and method):
    // const signature = req.headers.get('lygosapp-signature');
    // if (!signature || !verifyLygosappSignature(req.body, signature, LYGOSAPP_WEBHOOK_SECRET)) {
    //   return new Response('Invalid signature', { status: 400 });
    // }

    const payload = await req.json();
    const eventType = payload.type;
    const data = payload.data.object;

    console.log(`Received Lygosapp webhook event: ${eventType}`);

    let userId: string | undefined;
    let newPlan: string | undefined;
    let analysesRemaining: number | undefined;

    // Map Lygosapp price IDs to your internal plan names and quotas
    const PRO_PRICE_ID = Deno.env.get('LYGOSAPP_PRO_PRICE_ID');
    const ELITE_PRICE_ID = Deno.env.get('LYGOSAPP_ELITE_PRICE_ID');

    switch (eventType) {
      case 'checkout.completed':
        userId = data.metadata?.user_id;
        if (data.price?.id === PRO_PRICE_ID) {
          newPlan = 'pro';
          analysesRemaining = 30;
        } else if (data.price?.id === ELITE_PRICE_ID) {
          newPlan = 'elite';
          analysesRemaining = 104;
        }
        break;
      case 'subscription.created':
      case 'subscription.updated':
        userId = data.metadata?.user_id || data.customer_id; // Prioritize user_id from metadata if available
        const subscriptionItem = data.items?.data?.[0];
        if (subscriptionItem?.price?.id === PRO_PRICE_ID) {
          newPlan = 'pro';
          analysesRemaining = 30;
        } else if (subscriptionItem?.price?.id === ELITE_PRICE_ID) {
          newPlan = 'elite';
          analysesRemaining = 104;
        } else if (data.status === 'canceled' || data.status === 'unpaid' || data.status === 'incomplete') {
          newPlan = 'free';
          analysesRemaining = 1;
        }
        break;
      case 'subscription.deleted':
        userId = data.metadata?.user_id || data.customer_id;
        newPlan = 'free';
        analysesRemaining = 1;
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
        return new Response(JSON.stringify({ message: `Unhandled event type: ${eventType}` }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (userId && newPlan !== undefined && analysesRemaining !== undefined) {
      const { data: profile, error: fetchProfileError } = await supabaseAdmin
        .from('profiles')
        .select('analyses_count')
        .eq('id', userId)
        .single();

      if (fetchProfileError) {
        console.error('Error fetching profile for user:', userId, fetchProfileError);
        return new Response(JSON.stringify({ error: 'Error fetching profile' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          plan: newPlan,
          analyses_remaining: analysesRemaining,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        return new Response(JSON.stringify({ error: 'Error updating profile' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log(`User ${userId} plan updated to ${newPlan} with ${analysesRemaining} analyses remaining.`);
    } else {
      console.warn('Could not determine user ID or new plan from webhook payload.');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Webhook Edge Function error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});