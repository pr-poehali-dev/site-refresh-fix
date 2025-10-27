import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Добавление нового русификатора в базу (только с паролем администратора)
    Args: event - dict с httpMethod, body, headers
          context - object с request_id
    Returns: HTTP response с результатом добавления
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    provided_password = headers.get('x-admin-password') or headers.get('X-Admin-Password')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if not provided_password or provided_password != admin_password:
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Неверный пароль администратора'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    game = body_data.get('game')
    mod_name = body_data.get('modName')
    author = body_data.get('author')
    version = body_data.get('version')
    download_url = body_data.get('downloadUrl')
    
    if not all([game, mod_name, author, version, download_url]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Все поля обязательны для заполнения'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO translations (game, mod_name, author, version, download_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (game, mod_name, author, version, download_url)
    )
    
    translation_id = cur.fetchone()[0]
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'id': translation_id,
            'message': 'Русификатор успешно добавлен'
        }),
        'isBase64Encoded': False
    }
