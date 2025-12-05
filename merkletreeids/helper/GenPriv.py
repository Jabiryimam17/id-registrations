import secrets
priv_key_hex = secrets.token_hex(32)
priv_key_int = int(priv_key_hex, 16)


# BabyJub scalar field order (same as eddsa.js uses)
babyjub_suborder = 21888242871839275222246405745257275088548364400416034343698204186575808495617

priv_key_int %= babyjub_suborder
