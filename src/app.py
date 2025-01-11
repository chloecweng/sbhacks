from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    print("Starting Flask app with debug mode ON")
    app.run(debug=True)