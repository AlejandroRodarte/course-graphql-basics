// declaring subscriptions
const Subscription = {

    // the count subscription
    count: {
        subscribe(parent, args, { pubsub }, info) {

            let count = 0;

            // each second, increment the count value and publish its final value with publish(),
            // name the channel through which send the information and the data to emit, which must match
            // the return type when we declared the subscription on the type definition file
            setInterval(() => {
                count++;
                pubsub.publish('count', { count });
            }, 1000);

            // set up the 'count' channel (similar to the 'rooms' concept in socket.io)
            // all subscribers to the channel 'count' will receive published data
            return pubsub.asyncIterator('count');

        }
    }

};

export { Subscription as default };