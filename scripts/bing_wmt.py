#!/usr/bin/env python3
"""Resumen mensual de Bing Webmaster Tools para un sitio (2026-11-11).

Bing es una de las fuentes de la búsqueda de ChatGPT y de Copilot. Lo usa el
reporte mensual de SEO.

Uso: python3 scripts/bing_wmt.py --site https://hyppo.io/ --month 2026-11
Imprime JSON: clicks e impresiones del mes y del mes previo, top 10 queries del
mes, y el estado de crawl más reciente.

La clave sale de la variable de entorno BING_WEBMASTER_API_KEY y NUNCA se
imprime (tampoco en errores: se tapa en cualquier mensaje). Si la variable no
existe, imprime {"error": "sin BING_WEBMASTER_API_KEY"} y sale con 0.
Solo stdlib: urllib respeta HTTPS_PROXY, como el proxy de las rutinas en la nube.
"""
import argparse, datetime as dt, json, os, re, sys, urllib.parse, urllib.request

API = 'https://ssl.bing.com/webmaster/api.svc/json/'
KEY = os.environ.get('BING_WEBMASTER_API_KEY', '').strip()


def out(obj):
    print(json.dumps(obj, ensure_ascii=False, indent=2))


def call(method, site):
    url = f"{API}{method}?siteUrl={urllib.parse.quote(site, safe='')}&apikey={KEY}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'hyppo-seo-report'}), timeout=60) as r:
            return json.load(r).get('d') or []
    except Exception as e:  # nunca filtrar la clave en el mensaje
        raise RuntimeError(f'{method}: ' + str(e).replace(KEY, '***')) from None


def day(v):
    return dt.date.fromtimestamp(int(re.search(r'-?\d+', v).group()) / 1000)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--site', required=True, help='URL exacta del sitio en Bing, con barra final')
    ap.add_argument('--month', required=True, help='AAAA-MM')
    a = ap.parse_args()
    if not KEY:
        out({'site': a.site, 'error': 'sin BING_WEBMASTER_API_KEY'})
        return
    y, m = map(int, a.month.split('-'))
    start = dt.date(y, m, 1)
    end = (start.replace(day=28) + dt.timedelta(days=4)).replace(day=1)
    pstart = (start - dt.timedelta(days=1)).replace(day=1)
    try:
        traffic = call('GetRankAndTrafficStats', a.site)
        queries = call('GetQueryStats', a.site)
        crawl = call('GetCrawlStats', a.site)
    except RuntimeError as e:
        out({'site': a.site, 'error': str(e)})
        return

    def tot(rows, lo, hi):
        sel = [r for r in rows if lo <= day(r['Date']) < hi]
        return {'dias_con_datos': len(sel), 'clicks': sum(r.get('Clicks', 0) for r in sel),
                'impresiones': sum(r.get('Impressions', 0) for r in sel)}

    q = {}
    for r in queries:
        if start <= day(r['Date']) < end:
            k = r.get('Query', '')
            e = q.setdefault(k, {'query': k, 'clicks': 0, 'impresiones': 0})
            e['clicks'] += r.get('Clicks', 0)
            e['impresiones'] += r.get('Impressions', 0)
    top = sorted(q.values(), key=lambda x: (-x['impresiones'], -x['clicks']))[:10]
    last = crawl[-1] if crawl else None
    out({
        'site': a.site,
        'mes': a.month,
        'trafico_mes': tot(traffic, start, end),
        'trafico_mes_previo': tot(traffic, pstart, start),
        'top_queries_mes': top,
        'crawl_ultimo_dia': None if not last else {
            'fecha': str(day(last['Date'])), 'paginas_crawleadas': last.get('CrawledPages'),
            'en_indice': last.get('InIndex'), 'errores_de_crawl': last.get('CrawlErrors')},
        'nota': 'Bing tarda ~48 h en mostrar datos de un sitio recién importado; dias_con_datos = 0 no es cero visitas.',
    })


if __name__ == '__main__':
    main()
