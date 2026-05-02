# WAMS - Microservices Architecture

## Architecture

L’application est basée sur une architecture microservices :

- 🔐 Auth Service (Django - accounts)
- 📦 Booking Service (Django - bookings)
- ⚙️ Worker Service (RabbitMQ consumer)

## Communication

- REST API (HTTP)
- RabbitMQ (asynchronous messaging)

## Flow

1. User creates reservation
2. API sends message to RabbitMQ
3. Worker consumes message
4. Reservation is automatically confirmed

## Technologies

- Django REST Framework
- React
- RabbitMQ
- JWT Authentication