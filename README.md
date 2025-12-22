
# EasygoPharm - Production Deployment Guide

## Overview
EasygoPharm is a production-ready platform for rare drug sourcing. This version utilizes Supabase for persistent storage, Resend for emails, and Twilio for WhatsApp alerts.

## Infrastructure Setup

### 1. Database (Supabase)
Create the following tables in your Supabase project:

**users**
- id (uuid, pk)
- username (text)
- name (text)
- role (text)
- password (text)

**drug_requests**
- id (uuid, pk)
- genericName (text)
- brandName (text)
- dosageStrength (text)
- quantity (text)
- requesterName (text)
- requesterType (text)
- contactEmail (text)
- contactPhone (text)
- urgency (text)
- notes (text)
- status (text)
- aiAnalysis (text)
- aiSources (jsonb)
- created_at (timestamp)

**consultations**
- id (uuid, pk)
- patientName (text)
- contactEmail (text)
- contactPhone (text)
- preferredDate (timestamp)
- reason (text)
- status (text)
- created_at (timestamp)

**audit_logs**
- id (uuid, pk)
- action (text)
- user (text)
- timestamp (timestamp)

### 2. Notifications (Resend & Twilio)
- **Resend**: Create an account and obtain an API Key.
- **Twilio**: Create an account, enable the WhatsApp Sandbox (or a Production sender), and obtain SID/Token/Phone.

## Deployment Instructions

1.  **Configure ENV**: Set all variables listed in `.env.example`.
2.  **Build**: `npm run build`
3.  **Host**: Deploy `dist/` to your chosen provider (Vercel recommended for serverless API support).

## Verification
- Submit a drug request: Check Supabase dashboard for the record.
- Verify Inbox: A confirmation email should arrive from Resend.
- Verify WhatsApp: A message should arrive from the Twilio Sender.
