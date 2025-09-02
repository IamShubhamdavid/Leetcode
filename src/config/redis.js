const { createClient } = require ('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19712.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 19712
    }
});

module.exports= redisClient;

