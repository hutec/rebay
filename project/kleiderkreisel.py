from bs4 import BeautifulSoup
import urllib3
import urllib
import html
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

http = urllib3.PoolManager()

# soup = BeautifulSoup(html_doc, "html.parser")

max_pages = 5


base_url = "https://www.kleiderkreisel.de/herren?search_text=" # &page=2
redirect_base_url = "https://www.kleiderkreisel.de"

def get_items(keywords=""):
    logger.info("Kleiderkreisel API called with keywords {}".format(keywords))

    items = []
    page = 1

    response = http.request("GET", base_url + urllib.parse.quote(keywords))
    soup = BeautifulSoup(response.data, "html.parser")  # eventually use lxml
    item_divs = soup.findAll("div", {"class": "item-box__container"})

    while len(item_divs) > 0 and page <= max_pages:
        for item_div in item_divs:
            item = dict()
            try:
                # item['description'] = item_div.find("div", {"class": "media-caption__body"}).text
                item['description'] = item_div.find("img")['alt']
                item['pictureURLLarge'] = item_div.find("img")['data-src']
                item['price'] = item_div.find("div", {"class": "item-box__title"}).text.strip("\n").strip("€")
                item['viewItemURL'] = redirect_base_url + item_div.find("a", {"class": "js-item-link"})['href']
                items.append(item)
            except AttributeError:
                from IPython import embed
                embed()

        page += 1
        response = http.request("GET", base_url + urllib.parse.quote(keywords) +  "&page=" + str(page))
        soup = BeautifulSoup(response.data, "html.parser")  # eventually use lxml
        item_divs = soup.findAll("div", {"class": "item-box__container"})

     # from IPython import embed
     # embed()

    logger.info("Found {} items".format(len(items)))


    return {"searchResult": {
            "_count": len(items),
            "item": items
        }}

if  __name__ == "__main__":
    # print(get_items("levis"))
    items = get_items("norse projects")
    from IPython import embed
    embed()


