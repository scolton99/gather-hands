const already_raised_hands = [];
const already_in_room = [];
let should_play_sound = true;

const people_dom = () => {
    const people = Array.from(document.querySelectorAll("div.LeftBarParticipants-nameRows div.LeftBarParticipantsNameRow-root"));

    return people.length === 0 ? null : people;
};

const to_names = dom => (
    dom.map(it => it.querySelector("p.Text.LeftBarParticipantsNameRow-name").textContent)
);

const currently_raised_hands = () => {
    const people = people_dom();
    return people === null ? null : to_names(people.filter(x => x.querySelector("div.LeftBarParticipants-hand-raised") !== null));
};

const currently_in_room = () => {
    const people = people_dom();
    return people === null ? null : to_names(people);
};

const cache_cmp_and_maintain = (cache_list, obs_list) => {
    if (!cache_list || !obs_list) return;
    let found_new_in_obs = false;

    for (const obs of obs_list) {
        if (!cache_list.includes(obs)) {
            cache_list.push(obs);
            found_new_in_obs = true;
        }
    }

    for (const cache of cache_list) {
        if (!obs_list.includes(cache)) {
            cache_list.splice(cache_list.indexOf(cache), 1);
        }
    }

    return found_new_in_obs;
};

const check = () => {
    console.log(already_in_room);
    console.log(already_raised_hands);

    check_hands();
    check_people();

    console.log(already_in_room);
    console.log(already_raised_hands);

    should_play_sound = true;
};

const play_sound = event => {
    chrome.storage.sync.get({ [`sound_on_${event}`]: true }, (data => {
        if (data[`sound_on_${event}`]) {
            const ping = new Audio(chrome.runtime.getURL('assets/ping.wav'));
            ping.play();
            should_play_sound = false;
        }
    }));
};

const check_hands = () => {
    const raised_hands = currently_raised_hands().filter(it => !it.endsWith(" (me)"));

    const found_diff = cache_cmp_and_maintain(already_raised_hands, raised_hands);
    if (found_diff && should_play_sound)
        play_sound('hand');
};

const check_people = () => {
    const in_room = currently_in_room().filter(it => !it.endsWith(" (me)"));

    const found_diff = cache_cmp_and_maintain(already_in_room, in_room);
    if (found_diff && should_play_sound)
        play_sound('enter');
};

const load = () => {
    const hands = currently_raised_hands();
    const room = currently_in_room();

    console.log("START: ", room);

    if (room === null) return window.setTimeout(load, 100);

    for (const hand of hands)
        already_raised_hands.push(hand);

    for (const person of room)
        already_in_room.push(person);

    window.setInterval(check, 2000);
};

load();
