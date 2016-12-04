from flask import Flask
from flask import request

app = Flask(__name__)


@app.route('/', methods=['GET'])
def get_query():
    input_request = request.args.get('query')
    print('request->' + str(input_request))
    if 'who is abhinav' in input_request:
        response = 'Abhinav Tyagi is Innovative Solitaire'
    else:
        response = 'Server is facing some issue. Please try again later!'
    return response


@app.route('/query', methods=['POST'])
def post_query():
    input_request = request.get_json(silent=True)
    print('request->'+str(input_request))

    if 'query' in input_request:
        print('request-->'+input_request['query'])
        if 'who is abhinav' in input_request['query']:
            response = 'Abhinav Tyagi is Innovative Solitaire'
    else:
        response = 'Server is facing some issue. Please try again later!'
    print("response->"+response)
    return response


if __name__ == '__main__':
    app.run()#host='0.0.0.0', port=9000)
