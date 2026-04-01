import http.server, os
os.chdir('/Users/litingkway/Downloads/proj_townhall')
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=4321, bind='127.0.0.1')
