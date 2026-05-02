import pika
import json


def send_reservation_message(data):
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='localhost')
        )
        channel = connection.channel()

        channel.queue_declare(queue='reservations', durable=True)

        channel.basic_publish(
            exchange='',
            routing_key='reservations',
            body=json.dumps(data),
            properties=pika.BasicProperties(
                delivery_mode=2
            )
        )

        print("✅ Message envoyé à RabbitMQ :", data)

        connection.close()

    except Exception as e:
        print("❌ Erreur RabbitMQ :", str(e))


# 🔥 TEST (EN DEHORS DE LA FONCTION)
if __name__ == "__main__":
    send_reservation_message({"test": "hello"})