import unittest

from project import ebay

import time
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TestEbaySpeed(unittest.TestCase):

    def test_get_favorite_searches(self):
        start = time.time()
        ebay.get_favorite_searches(config_file="project/ebay.yaml")
        end = time.time()
        logger.info("Elapsed time for get_favorite_search: {}".format(end - start))

if __name__ == '__main__':
    unittest.main()
