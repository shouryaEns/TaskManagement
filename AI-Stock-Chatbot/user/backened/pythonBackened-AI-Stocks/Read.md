<!-- python running cammands: -->

<!-- to run the python program -->
1. source venv/bin/activate
2. uvicorn app.main:app --reload

# Folder Structure for python:
auth-product-api/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── config.py
│   ├── models/
│   │     ├── user.py
│   │     └── product.py
│   ├── schemas/
│   │     ├── user.py
│   │     └── product.py
│   ├── routes/
│   │     ├── user.py
│   │     └── product.py
│   ├── auth.py
│
├── requirements.txt
└── .env