from mysql.connector import pooling

import os
from dotenv import load_dotenv

load_dotenv()

connection_pool = pooling.MySQLConnectionPool(
    pool_name="Nation ID Pool",
    pool_size=3,
    host = os.getenv("DB_HOST"),
    database = os.getenv("DB_NAME"),
    user = os.getenv("DB_USER"),
    password = os.getenv("DB_PASSWORD")
)

