import app from '../app';
import config from '../config';

const port = config.server.port || 8082;

app.listen(port);
console.log(`app started at port ${port}...`);