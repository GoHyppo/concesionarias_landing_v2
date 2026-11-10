"""Credenciales Google del service account para las rutinas (blog-daily, seo-ops,
reporte mensual).

Orden de búsqueda (la primera que exista gana):
  1. $GOOGLE_SA_JSON_B64: JSON del SA en base64 (variable del environment cloud).
  2. $GOOGLE_APPLICATION_CREDENTIALS: path a un archivo JSON (corrida local).

La clave se carga en memoria y nunca se escribe a disco ni se imprime. Antes las
rutinas la bajaban de Drive a /tmp/sa.json; el 13/10/2026 el clasificador de la
nube empezó a bloquear ese paso ("Credential Leakage") y la rutina ai-enrich del
otro repo no corrió. Con este helper el agente no toca la credencial.

Uso (con el python del venv: el del sistema tiene cryptography rota):
    import sys; sys.path.insert(0, 'scripts')
    from gauth import service, session

    gsc = service('searchconsole', 'v1', ['https://www.googleapis.com/auth/webmasters'])
    docs = service('docs', 'v1', ['https://www.googleapis.com/auth/documents'])
    drive = service('drive', 'v3', ['https://www.googleapis.com/auth/drive'])

    # REST sin cliente de discovery (URL Inspection, GA4 Data API):
    s = session(['https://www.googleapis.com/auth/analytics.readonly'])
    s.post('https://analyticsdata.googleapis.com/v1beta/properties/451030561:runReport', json={...})

Chequeo de humo: `python scripts/gauth.py` (imprime solo el email del SA).
"""

import base64
import json
import os

from google.oauth2 import service_account

DEFAULT_SCOPES = [
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/analytics.readonly",
]


def credentials(scopes=None):
    scopes = scopes or DEFAULT_SCOPES
    b64 = os.environ.get("GOOGLE_SA_JSON_B64", "").strip()
    if b64:
        info = json.loads(base64.b64decode(b64))
        return service_account.Credentials.from_service_account_info(info, scopes=scopes)
    path = os.path.expanduser(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ""))
    if path and os.path.exists(path):
        return service_account.Credentials.from_service_account_file(path, scopes=scopes)
    raise SystemExit(
        "Sin credenciales Google: falta GOOGLE_SA_JSON_B64 en el environment "
        "(o GOOGLE_APPLICATION_CREDENTIALS apuntando a un archivo)."
    )


def service(name, version, scopes=None):
    from googleapiclient.discovery import build

    return build(name, version, credentials=credentials(scopes), cache_discovery=False)


def session(scopes=None):
    from google.auth.transport.requests import AuthorizedSession

    return AuthorizedSession(credentials(scopes))


if __name__ == "__main__":
    print("SA ok:", credentials().service_account_email)
