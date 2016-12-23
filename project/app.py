from flask import Flask, render_template, jsonify, request
from ebay import get_favorite_searches, find_in_europe

app = Flask(__name__)

@app.route('/ebay/favorites')
def ebay_favorites():
    return jsonify(
        get_favorite_searches()
    )


@app.route('/ebay/search')
def ebay_search():
    keywords = request.args.get('keywords', 'carmina 7')
    return jsonify(
        find_in_europe(keywords)
    )


@app.route('/')
def app():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
