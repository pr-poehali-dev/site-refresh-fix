import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка всех русификаторов из базы данных
    Args: event - dict с httpMethod, queryStringParameters
          context - object с request_id
    Returns: HTTP response с JSON массивом русификаторов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    params = event.get('queryStringParameters', {}) or {}
    game_filter = params.get('game')
    
    if game_filter:
        cur.execute(
            "SELECT id, game, mod_name, author, version, download_url, created_at FROM translations WHERE game = %s ORDER BY created_at DESC",
            (game_filter,)
        )
    else:
        cur.execute("SELECT id, game, mod_name, author, version, download_url, created_at FROM translations ORDER BY created_at DESC")
    
    rows = cur.fetchall()
    
    translations = []
    for row in rows:
        translations.append({
            'id': str(row[0]),
            'game': row[1],
            'modName': row[2],
            'author': row[3],
            'version': row[4],
            'downloadUrl': row[5],
            'createdAt': row[6].isoformat() if row[6] else None
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(translations),
        'isBase64Encoded': False
    }
