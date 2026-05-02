import pika
import json
import os
import django
print("🟢 Service Worker lancé (microservice indépendant)")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core_api.settings")
django.setup()

from bookings.models import Reservation


def callback(ch, method, properties, body):
    data = json.loads(body)
    print("📩 Message reçu :", data)

    try:
        reservation = Reservation.objects.get(id=data["id"])
        reservation.status = "confirmed"
        reservation.save()
        print("✅ Réservation confirmée automatiquement")

    except Exception as e:
        print("❌ Erreur :", str(e))

    ch.basic_ack(delivery_tag=method.delivery_tag)


def start_worker():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost')
    )
    channel = connection.channel()

    channel.queue_declare(queue='reservations', durable=True)

    channel.basic_consume(
        queue='reservations',
        on_message_callback=callback
    )

    print("🚀 Worker lancé... en attente de messages")

    channel.start_consuming()


if __name__ == "__main__":
    start_worker()