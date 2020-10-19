const save_options = () => {
    const options = document.querySelectorAll("input[type='checkbox'");

    const option_vals = {};
    for (const option of options) {
        option_vals[option.name] = option.checked;
    }

    chrome.storage.sync.set(option_vals, () => {
        document.getElementById("status").textContent = "Options saved!";

        window.setTimeout(() => {
            document.getElementById("status").textContent = "";
        }, 2000);
    });
};

const restore_options = () => {
    const options = document.querySelectorAll("input[type='checkbox'");
    
    const vals_to_load = {};
    for (const option of options) {
        vals_to_load[option.name] = option.dataset.default == 'true';
    }

    chrome.storage.sync.get(vals_to_load, data => {
        for (const [key, val] of Object.entries(data)) {
            const dom_el = document.querySelector(`[name='${key}'`);
            dom_el.checked = val;
        }
    });
};

const load = () => {
    document.getElementById("save").addEventListener("click", save_options);
    restore_options();
}

window.addEventListener("load", load);