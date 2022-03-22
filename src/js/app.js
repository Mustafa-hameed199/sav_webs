new Vue({
    el:"#app",
    data() {
        return {
            webURL: "",
            webName: "",
            webCategory: "",
            links: [],
            categories: [],
            linksToShowInNav: 3,
            mobile: false,
            dblPress: true,
        }
    },
    methods: {
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Push Object With His Stuff To The links Array ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        pushToArray(e) {
            if (e.target.tagName.toLowerCase() == "select") {
                if (this.webURL.trim() == "" || this.webName.trim() == "") return;
                this.webCategory = e.target.value;
            } else {
                if (this.webURL.trim() == "" || this.webName.trim() == "" || this.webCategory.trim() == "" ) return;
            }
            let ob = {
                id: new Date(),
                url: this.webURL,
                name: this.webName,
                place: this.webCategory
            }

            this.links.push(ob);
            this.addCategories();
            this.addSection();
            this.addToLocal();

            const userInputs = document.querySelector(".user__inputs");
            userInputs.style.setProperty("--rot", 0);

            this.webURL = ""
            this.webName = ""
            this.webCategory = ""
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Home Btn Click ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        homeBtn() {
            document.querySelector("[data-scroll = 'user']").click();
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Move The Focus To Other Input When Click Enter(next) Or Delete(previous) & Turn on pushToArray Function When Click Enter On Last Input & Rotate The Inputs  ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        moveToNextInput(e , direction) {
            const inputs = document.querySelectorAll(".user__inputs input");
            const activeInput = document.querySelector(".user__inputs input.active");
            const userInputs = document.querySelector(".user__inputs");
            const x = getComputedStyle(userInputs);
            const value = x.getPropertyValue("--rot");

            let el = e.target;

            if (el.classList.contains("add-btn")) el = activeInput;

            if (direction == "next") {
                if (!el.nextElementSibling) {
                    this.pushToArray(e);
                    userInputs.firstElementChild.focus();
                    userInputs.style.setProperty("--rot", 0);
                    inputs.forEach(input => input.classList.remove("active"));
                    inputs[0].classList.add("active");
                    return;
                }
                inputs.forEach(input => input.classList.remove("active"));
                el.nextElementSibling.classList.add("active");
                userInputs.style.setProperty("--rot", parseInt(value) + 90);
                el.nextElementSibling.focus();

            } else {
                if (!el.value == "") return;
                if (this.dblPress) {
                    this.dblPress = !this.dblPress;
                } else {
                    inputs.forEach(input => input.classList.remove("active"));
                    el.previousElementSibling.classList.add("active");
                    userInputs.style.setProperty("--rot", parseInt(value) - 90);
                    el.previousElementSibling.focus();
                    this.dblPress = !this.dblPress;
                }
            }
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Add The Section & Deal With Duplicated Section ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        addSection() {
            const app = document.getElementById("app");
            if (this.links.length > 0 ) {
                let arr = [...new Set(this.categories)];
                
                arr.forEach(text => {
                    setTimeout(() => {
                        const linkContent = document.querySelectorAll(`.${text}__item`);
                        let section = document.createElement("section");
                        let container = document.createElement("div");
                        container.className = "container"
                        section.className =`${text} main-sec links__section`;
                        section.id = text;

                        section.appendChild(container);
                        
                        if (document.getElementById(text)) {
                            section = document.getElementById(text);
                        }
                        
                        linkContent.forEach(link => section.children[0].appendChild(link));
                        app.appendChild(section);
                    },0)
                })
            }
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Delete The Item & Section If It Was The Only Item ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        deleteItem(index,e) {
            let section = e.target.parentElement.parentElement.parentElement
            if (section.firstElementChild.children.length <= 1) section.remove();
            e.target.parentElement.remove();
            this.links.splice(index , 1);
            this.categories = [];
            this.addCategories();
            this.addSection();
            this.addToLocal();
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Add The Categories From links ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        addCategories() {
            this.links.forEach(link => this.categories.push(link.place));
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Get The Select To The Start When Choose & Focus On First Input ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        resetSelect(e) {
            e.target.selectedIndex = "0"
            e.target.parentElement.firstElementChild.firstElementChild.focus();
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Add To LocalStorage ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        addToLocal() {
            localStorage.setItem("links",JSON.stringify(this.links))
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Check Screen For Mobile Width ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        checkScreen() {
            window.addEventListener("resize",() => {
                if (window.innerWidth <= 768 ) this.mobile = true; 
                else this.mobile = false; 
            });
            if (window.innerWidth <= 768 ) this.mobile = true; 
            else this.mobile = false; 
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ When Click Nav Icon ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        navIcon(e) {
            e.target.classList.toggle("animate");
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Nav Link Click ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        navLink(e) {
            const icon = document.querySelector(".nav__icon");
            const links = document.querySelectorAll(".nav__link");
            const menuLinks = document.querySelectorAll(".menu__link");
            const header = document.querySelector(".header");
            const ActiveInput = document.querySelector(".user__inputs input.active")
            const a = e.target;
        
            if (a.dataset.scroll == "user") ActiveInput.focus();
            if (icon && !a.classList.contains("other")) icon.classList.remove("animate");
            links.forEach(link => link.classList.remove("active"));
            if (!a.classList.contains("other")) menuLinks.forEach(link => link.classList.remove("active"));
            a.classList.add("active");
            if (a.classList.contains("other")) return;

            const section = document.getElementById(a.dataset.scroll);
            window.scrollTo({
                top: section.offsetTop - header.getBoundingClientRect().height + 1,
                behavior: "smooth",
            })
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Logo Click ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        logoClick() {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Sync Links With Section ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        syncLinks() {
            const links = document.querySelectorAll(".nav__link:not(.other)");
            const linksAll = document.querySelectorAll(".nav__link");
            const menuLinks = document.querySelectorAll(".menu__link");
            const lastLink = document.querySelector(".nav__link.other");

            setTimeout(() => {
                links.forEach(link => {
                        let section = document.getElementById(link.dataset.scroll);
                        const header = document.querySelector(".header");
                        let h = header.getBoundingClientRect().height;
                        let sectionHeight = section.getBoundingClientRect().height;
                        let y = h + (sectionHeight / 2 )

                        if ( scrollY >= section.offsetTop - y ) {
                            linksAll.forEach(a => a.classList.remove("active"));
                            link.classList.add("active");
                            this.moveLineToActive()
                        }
                    })

                if (menuLinks) {
                    menuLinks.forEach(link => {
                        let section = document.getElementById(link.dataset.scroll);
                        const header = document.querySelector(".header");
                        let h = header.getBoundingClientRect().height;
                        let sectionHeight = section.getBoundingClientRect().height;
                        let y = h + (sectionHeight / 2 )
                            if ( scrollY >= section.offsetTop - y ) {
                                linksAll.forEach(a => a.classList.remove("active"));
                                lastLink.classList.add("active");
                                this.moveLineToActive()
                            }
                    })
                }
            }, 0 )
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Nav Menu Links Show ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        menuLinksShow() {
            const ul = document.querySelector(".nav__menu");
            ul.classList.add("show");
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Nav Menu Links Hide ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        menuLinksHide() {
            const ul = document.querySelector(".nav__menu");
            ul.classList.remove("show");
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Move The Line Under The Link ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        moveLine(e) {
            if (this.mobile) return; 
            const a = e.target;
            const line = document.querySelector(".nav__links .lineMove");
            
            let w = a.getBoundingClientRect().width;
            let l = a.offsetLeft;
        
            line.style.left = l + "px";
            line.style.width = w + "px";
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Get Back Line To Active link ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        moveLineToActive(e) {
            const line = document.querySelector(".nav__links .lineMove");
            if (!line) return;
            if (!document.querySelector(".nav__link.active")) {
                const a = e.target
                line.style.cssText = `left: ${a.offsetLeft}px; width: 0`;
                return;
            }
            const a = document.querySelector(".nav__link.active");
            
            let w = a.getBoundingClientRect().width;
            let l = a.offsetLeft ;
            
            line.style.left = l + "px";
            line.style.width = w + "px";
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Get Line In Right Position On Resize Window  ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        lineResize() {
            const line = document.querySelector(".nav__links .lineMove");
            const a = document.querySelector(".nav__link.active");
            if (!a || !line) return;
            let w = a.getBoundingClientRect().width;
            let l = a.offsetLeft;

            line.style.left = l + "px";
            line.style.width = w + "px";
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Header Background On Scroll ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        headerScroll() {
            const header = document.querySelector(".header");
            if (scrollY > 100 ) header.classList.add("header-scroll")
            else header.classList.remove("header-scroll")
        },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Body Padding Top Cuz Header Position Is Fixed ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
        bodyPadding() {
            const header = document.querySelector(".header");
            const body = document.body;
            body.style.paddingTop = `${header.getBoundingClientRect().height}px`;
        }
},
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Save A Uniq Value Of Categories To Display It In Nav & Select Box & Nav Menu ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
    computed: {
      // --------------- Nav Items -----------
        allCategories() {
            let arr = [...new Set(this.categories)];
            if (arr.length < this.linksToShowInNav) return arr;
            else return arr.slice(0,this.linksToShowInNav);
        },
      // --------------- Nav Menu -----------
        CategoriesForMenu() {
            let arr = [...new Set(this.categories)];
            if (arr.length > this.linksToShowInNav ) return arr.slice(this.linksToShowInNav)
            else return false 
        },
      // --------------- Select Box -----------
        allUniqCategories() {
            return [...new Set(this.categories)];
        },
    },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ On Page Load Create The Section & Input Focus & Body Padding Top & Check For Mobile & Sync Links ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
    mounted() { 
        document.querySelector("input[type='url']").focus();
        document.querySelector(".nav__logo a").click()
        this.addSection();
        this.bodyPadding();
        this.checkScreen();
        this.syncLinks();
    },
// ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏ Get The Data From LocalStorage & More Stuff :)  ✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏✏
    created() {
        window.addEventListener("scroll",() => {
            this.bodyPadding();
            this.headerScroll();
            this.syncLinks();
        });

        window.addEventListener("resize",() => {
            this.lineResize();
            this.bodyPadding();
        });
        
        this.checkScreen();

        if (!localStorage.getItem("links")) return;
        let data = JSON.parse(localStorage.getItem("links"));
        this.links = data;
        this.addCategories();

        
    },
})