from ebaysdk.trading import Connection as Trading
from ebaysdk.finding import Connection as Finding
from ebaysdk.exception import ConnectionError
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SITEID = 'EBAY-DE'  # Trading API needs 77


def get_favorite_searches():
    """
    Return favorite searches

    :return: dict
    """
    logger.info("Getting favorite searches")
    try:
        api = Trading(config_file='ebay.yaml', siteid='77')
        response = api.execute('GetMyeBayBuying', {
            'FavoriteSearches': {
                'Include': 'true',
                'IncludeListContents': 'true'
            }
        })
        return response.dict()
    except ConnectionError as e:
        logger.error(e)
        return dict()


def favorite_search_to_search():
    """
    Converts a favorite search element to an actual search.
    The favorite search does not contain the location preference.

    :return:
    """
    pass


def find_in_europe(keywords=""):
    logger.info("Finding API called with keywords {}".format(keywords))
    try:
        api = Finding(config_file="ebay.yaml", siteid=SITEID)
        response = api.execute('findItemsAdvanced', {
            'categoryId': 11450,
            'keywords': keywords,
            'sortOrder': 'EndTimeSoonest',
            'itemFilter': {
                'name': 'LocatedIn',
                'value': 'European'
            },
            'outputSelector': 'PictureURLLarge'
        })

        return response.dict()
    except ConnectionError as e:
        logger.error(e)


if __name__ == '__main__':
    logger.info("Running as main")
    get_favorite_searches()
    find_in_europe()

