from psycopg2 import pool

import os
from dotenv import load_dotenv

load_dotenv()

connection_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=3,
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT") or "5432"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

