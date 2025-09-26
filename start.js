import WhatsApp from 'whatsapp';

// Your test sender phone number
const wa = new WhatsApp( '+15551853228' );

// Enter the recipient phone number
const recipient_number = '+5511995404847';

async function send_message()
{
    try{
        const sent_text_message = wa.messages.text( { "body" : "Hello world" }, recipient_number );

        await sent_text_message.then( ( res ) =>
        {
            console.log( res.rawResponse() );
        } );
    }
    catch( e )
    {
        console.log( JSON.stringify( e ) );
    }
}

send_message();