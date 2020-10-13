const already_raised_hands = [];

const currently_raised_hands = () => {
    const people = Array.from(document.querySelectorAll("div.GameNamesList div.horizontal-container"));

    if (!people) return null;

    const hands = people.filter(x => x.querySelector("div.GameName-hand-raised") !== null);
    const raised_hands = hands.map(x => x.querySelector("div.GameName-name").textContent);

    return raised_hands;
};

const check_hands = () => {
    const raised_hands = currently_raised_hands();

    if (raised_hands === null) return;

    for (const name of raised_hands) {
        let sound_played = false;

        if (name.endsWith(" (me)")) continue;

        if (!already_raised_hands.includes(name)) {
            already_raised_hands.push(name);

            if (!sound_played) {
                const ping = new Audio(chrome.runtime.getURL('assets/ping.wav'));
                ping.play();
                sound_played = true;
            }
        }
    }

    for (const name of already_raised_hands) {
        if (!raised_hands.includes(name)) {
            already_raised_hands.splice(already_raised_hands.indexOf(name), 1);
        }
    }
};

const load = () => {
    const hands = currently_raised_hands();

    if (hands === null) return window.setTimeout(load, 100);

    for (const hand of hands)
        already_raised_hands.push(hand);

    window.setInterval(check_hands, 2000);
};

load();
