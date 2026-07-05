# GoBetween Tracker

A shipment tracking system built for Go Between India Logistics — a logistics middleman that connects shippers with carriers.

## What it does

- Admin can create a shipment with sender and destination details
- On confirmation the system generates a unique tracking number for that shipment
- Admin can update the shipment's tracking status as it moves for eg
  confirmed -> shipped -> delivered
- Customers can look up their shipment status anytime using just the tracking number no login required

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)

## Project Structure
- GoBetweenTracker/
- client/     # React app (admin dashboard + customer tracking page)
- server/     # Express API

## Status: In development

## Roadmap
- [x] Project scaffold
- [x] Backend server + MongoDB connection
- [ ] Shipment model + unique tracking number generation
- [ ] Admin APIs (create shipment, update status)
- [ ] Public tracking lookup API
- [ ] Admin dashboard UI
- [ ] Customer tracking UI
- [ ] Deployment
- [ ] (Future) Rate calculation based on preset pricing
