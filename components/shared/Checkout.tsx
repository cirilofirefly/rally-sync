import { useEffect } from 'react';
import { IEvent } from "@/lib/mongodb/database/models/event.model"
import { Button } from "../ui/button"
import { loadStripe } from '@stripe/stripe-js';
import { checkoutOrder } from '@/lib/actions/order.actions';
import { CheckoutOrderParams } from '@/types';

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent, userId: string}) => {
    
    const onCheckout = async() => {

        const order: CheckoutOrderParams = {
            eventTitle: event.title,
            eventId: event._id,
            price: event.price,
            isFree: event.isFree,
            buyerId: userId
        }

        await checkoutOrder(order);
    }

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);


    return (
    <form action={onCheckout} method="POST">
        <Button 
            type="submit" 
            role="link" 
            size="lg" 
            className="button sm:w-fit"
        >
            { event.isFree ? 'Get' : 'Buy'} Ticket
        </Button>
    </form>
  )
}

export default Checkout