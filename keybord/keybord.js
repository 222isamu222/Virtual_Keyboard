 //Keybordオブジェクトの定義
 const Keyboard = {
    //プロパティの定義
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capslock: false
    },

    init() {
        //主な要素の生成
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        //要素にクラスを持たせる
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard_keys');

        //DOMへ追加(組み立て)-1
        this.elements.keysContainer.appendChild(this._createKeys());
        //NodeListの取得
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key');
        //DOMへ追加(組み立て)-2
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //use-keyboard-inputクラスを用いた自動使用
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                })
            })
        });
    },
    
    _createKeys() {
        const fragment = document.createDocumentFragment();
        //キー配列
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        //icon適応
        const createIconHTML = (icon_name) => {
            return '<i class="material-icons">' + icon_name + '</i>';
        };

        //ボタンの生成(キー配列を処理)
        keyLayout.forEach(key => {
            //button属性の付与
            const keyElement = document.createElement('button');
            //改行の判定
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            //属性とクラスの付与
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            switch(key){
                case "backspace":
                    //バックスペースの場合の処理
                    keyElement.classList.add("keyboard_key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    },false);

                    break;

                case "caps":
                    //capsの場合の処理
                    keyElement.classList.add("keyboard_key--wide", "keyboard_key-activatable");
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');

                    keyElement.addEventListener("click", () => {
                        this._toggleCapslock();
                        keyElement.classList.toggle(".keyboard_key-activatable", this.properties.capslock);
                    },false);

                    break;
                
                case "enter":
                    //enterの場合の処理
                    keyElement.classList.add("keyboard_key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    },false);

                    break;

                case "space":
                    //spaceの場合の処理
                    keyElement.classList.add("keyboard_key-extra--wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    },false);

                    break;

                case "done":
                    //doneの場合の処理
                    keyElement.classList.add("keyboard_key-wide", "keyboard_key-dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    },false);

                    break;

                //基本の処理
                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capslock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    },false);

                    break;
                }

            //文書ツリーを保存
             fragment.appendChild(keyElement);

            //改行の処理
            if(insertLineBreak){
                fragment.appendChild(document.createElement('br'));
           }
        });

        return fragment;

    },

    _triggerEvent(handlerName) {
        if(typeof this.eventHandlers[handlerName] == "function"){
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapslock() {
        console.log('CAPS');
        this.properties.capslock = !this.properties.capslock;

        for (const key of this.elements.keys){
            if(key.childElementCount === 0){
                key.textContent = this.properties.capslock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },


    //キーボードの開閉時の関数
    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};


//ページ読み込み時にinit関数を呼び出し
window.addEventListener('DOMContentLoaded', function(){
    Keyboard.init();

});