const { JSDOM } = require('jsdom');
const axios = require('axios');

const fetchHolodule = async () => {
    const { data } = await axios.get('https://schedule.hololive.tv/');
    const dom = new JSDOM(data);
    const { document } = dom.window;

    const list = document.querySelector('main > div.holodule > div.container');
    const containers =
        list.children[0].children[0].children[0].children[0].children;

    let date = null;
    let result = [];
    for (let i = 0; i < containers.length; i++) {
        const eachContainer = containers[i].children[0].children;

        const rawDate =
            eachContainer[0].children[0].children[0]?.textContent || null;
        if (rawDate !== null) {
            date = rawDate.trim().split('\n')[0];
        }

        const movieList = eachContainer[1].children[0].children;
        for (let k = 0; k < movieList.length; k++) {
            if (movieList[k] !== undefined) {
                const movieUrl = movieList[k].children[0].href;

                const element =
                    movieList[k].firstElementChild.firstElementChild
                        .firstElementChild;

                // 0: name row
                // 0: time or 1: name
                const time =
                    element.children[0].firstElementChild.children[0].textContent.trim();
                const name =
                    element.children[0].firstElementChild.children[1].textContent.trim();

                // 1: thumbnail row
                const thumbnailUrl = element.children[1].firstElementChild.src;

                // 2: avators row
                let avators = [];
                const streamerList =
                    element.children[2].firstElementChild.children;
                for (let l = 0; l < streamerList.length; l++) {
                    const n = streamerList[l].firstElementChild.src;
                    avators.push(n);
                }

                result.push({
                    date,
                    time,
                    movieUrl,
                    thumbnailUrl,
                    name,
                    avators,
                });
            }
        }
    }

    return result;
};

module.exports = {
    fetchHolodule,
};
