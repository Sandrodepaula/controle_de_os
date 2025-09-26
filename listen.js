import WhatsApp from 'whatsapp';

const senderNumber = 15551853228;
const wa = new WhatsApp(senderNumber); 


const webhookCallbackFunction = wa.webhooks.callback( custom_callback );
function custom_callback ( statusCode, headers, body, resp, err )
{
    console.log(
        `Incoming webhook status code: ${ statusCode }\n\nHeaders:
        ${ JSON.stringify( headers ) }\n\nBody: ${ JSON.stringify( body ) }`
    );

    if( resp )
    {
        resp.writeHead(200, { "Content-Type": "text/plain" });
        resp.end();
    }

    if( err )
    {
        console.log( `ERROR: ${ err }` );
    }
}

async function check_status()
{
    setTimeout( () =>
    {
        console.log( `Webhook listener is running - ${ wa.webhooks.isStarted() }` );
    }, 5000 );
}

wa.webhooks.start( webhookCallbackFunction )
check_status();