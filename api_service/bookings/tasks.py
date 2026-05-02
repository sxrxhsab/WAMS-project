from celery import shared_task
import time

@shared_task
def send_confirmation_email(reservation_id):
    """
    Tâche asynchrone pour envoyer un email de confirmation
    """
    # Simulation d'un délai de traitement (5 secondes)
    time.sleep(5)
    
    print(f"\n{'='*50}")
    print(f"📧 [EMAIL SIMULÉ] Confirmation de réservation")
    print(f"Réservation N°: {reservation_id}")
    print(f"Statut: Confirmée")
    print(f"Message: Votre réservation a bien été prise en compte.")
    print(f"{'='*50}\n")
    
    return f"Email envoyé pour la réservation {reservation_id}"