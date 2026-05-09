import pika
import json
import time

print("🟢 Worker lancé")

connected = False

while not connected:
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='rabbitmq')
        )

        connected = True
        print("✅ Connecté à RabbitMQ")

    except pika.exceptions.AMQPConnectionError:
        print("⏳ RabbitMQ pas prêt, nouvelle tentative...")
        time.sleep(5)

channel = connection.channel()

channel.queue_declare(queue='reservations')

print("📨 En attente des messages...")

def callback(ch, method, properties, body):
    data = json.loads(body)

    print("📩 Message reçu :")
    print(data)

channel.basic_consume(
    queue='reservations',
    on_message_callback=callback,
    auto_ack=True
)

channel.start_consuming()