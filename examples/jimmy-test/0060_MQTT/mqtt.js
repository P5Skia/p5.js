const hostname = 'dev.pandahut.co';
const port = 9003;
const clientid = randomString(10);
let client = null;

function MQTTConnect() {
  client = new Paho.MQTT.Client(hostname, Number(port), clientid);
  console.log(client);

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({
    onSuccess: onConnect,
    useSSL: true
  });

  return client;
}
// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log('onConnect');
  client.subscribe('edison');
  message = new Paho.MQTT.Message('Hello from P5');
  message.destinationName = 'edison';
  client.send(message);
}

function mqttSend(msg) {
  message = new Paho.MQTT.Message(msg);
  message.destinationName = 'edison';
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log('onConnectionLost:' + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log('onMessageArrived:' + message.payloadString);
}

function randomString(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
