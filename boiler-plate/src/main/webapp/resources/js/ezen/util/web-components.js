'use strict';

export class ExampleWebComponent extends HTMLElement {
  constructor() {
    // 클래스 초기화. 속성이나 하위 노드는 접근할 수는 없다.
    super();
  }
  static get observedAttributes() {
    // 모니터링 할 속성 이름
    // <tag-name example="example"></tag-name>
    return ['example'];
  }
  connectedCallback() {
    // DOM에 추가되었다. 렌더링 등의 처리를 하자.
    this.start();
  }
  disconnectedCallback() {
    // DOM에서 제거되었다. 엘리먼트를 정리하는 일을 하자.
    this.stop();
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    // 속성이 추가/제거/변경되었다.
    this[attrName] = newVal;
  }
  adoptedCallback(oldDoc, newDoc) {
    // 다른 Document에서 옮겨져 왔음
    // 자주 쓸 일은 없을 것.
  }
  start() {
    // 필요에 따라 메서드를 추가할 수 있다.
    // 이 클래스 인스턴스는 HTMLElement이다.
    // 따라서 `document.querySelector('current-time').start()`로 호출할 수 있다.
    this.stop();
    this._timer = window.setInterval(() => {
      this.innerText = new Date().toLocaleString(this.locale);
    }, 1000);
  }
  stop() {
    // 이 메서드 역시 CurrentTime클래스의 필요에 의해 추가했다.
    if (this._timer) {
      window.clearInterval(this._timer);
      this._timer = null;
    }
  }
}
// <example-web-component> 태그가 ExampleWebComponent 클래스를 사용하도록 한다.
// customElements.define('example-web-component', ExampleWebComponent);

/**
 * 커스텀 select 태그
 */
export class EzenSelect extends HTMLElement {
  constructor() {
    // 클래스 초기화. 속성이나 하위 노드는 접근할 수는 없다.
    super();
  }

  static get observedAttributes() {
    // 모니터링 할 속성 이름
    // <tag-name example="example"></tag-name>
    return ['name'];
  }

  connectedCallback() {
    // DOM에 추가되었다. 렌더링 등의 처리를 하자.
    // select tag 생성
    this.makeSelectTag();

    // dropdown 생성
    this.makeDropdown();

    // dropdown 클릭 이벤트 추가
    this.setDropdowClickHandler();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // 속성이 추가/제거/변경되었다.
    this[attrName] = newVal;
  }

  makeSelectTag() {
    // 태그 생성시 부여한 name과 id
    const { name, id } = this;

    // 태그 생성시 함께 생성한 option태그들
    const options = this.querySelectorAll('option');

    // select 태그 생성
    const select = document.createElement('select');
    select.style.display = 'none'; // 보이지 않게 설정
    select.name = name; // name부여
    select.id = id; // id부여

    // 태그 생성시 생성한 option태그를 새로 생성한 select태그 자식으로 이동
    [...options].forEach((option, idx) => {
      select.append(option);
    });

    // 해당 태그에 생성한 select태그 추가
    this.append(select);

    // 생성한 select 태그를 class내부의 다른 function에서 접근할 수 있도록
    // 해당 태그의 property에 추가
    this.selectProps = {
      tag: select,
      options: select.querySelectorAll('option'),
    };
  }

  makeDropdown() {
    /**
     * 화면에 보일 dropdown 생성
     */
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown'); // style적용을 위한 class 부여

    // html 작성
    dropdown.innerHTML = `
      <a
         class="btn btn-primary dropdown-toggle d-flex justify-content-between align-items-center ezen-dropdown"
         href="#"
         role="button"
         id="ezenDropdown"
         data-bs-toggle="dropdown"
         aria-expanded="false"
       ></a>

       <ul class="dropdown-menu" aria-labelledby="ezenDropdown">
       </ul>
    `;

    // 화면에 보이는 select의 내용을 select 태그의 value로 설정
    const selected = dropdown.querySelector('#ezenDropdown');
    selected.innerHTML = this.selectProps.options[0].innerHTML;

    /**
     * option태그를 대신해서 화면에 보여질 dropdown-item 생성
     *  select태그의 option의 수 만큼 반복문 실행
     *  li태그와 a태그를 생성하고 a태그의 내용을 option태그의 내용으로 설정한 이후
     *  dropdown에 추가
     */
    const dropdownUlTag = dropdown.querySelector('ul');
    [...this.selectProps.options].forEach((option) => {
      const dropdownLiTag = document.createElement('li');

      const dropdownATag = document.createElement('a');
      dropdownATag.href = '#';
      dropdownATag.classList.add('dropdown-item');
      dropdownATag.innerHTML = option.innerHTML;

      dropdownLiTag.appendChild(dropdownATag);

      dropdownUlTag.appendChild(dropdownLiTag);
    });

    // 해당 태그에 dropdown추가
    this.append(dropdown);

    // 생성한 dropdown을 class내부의 다른 function에서 접근할 수 있도록
    // 해당 태그의 property에 추가
    this.dropdownProps = {
      wrap: dropdown,
      selected: selected,
      options: dropdown.querySelectorAll('ul li'),
    };
  }

  setDropdowClickHandler() {
    const { selected, options } = this.dropdownProps;

    [...options].forEach((option) => {
      option.addEventListener('click', (e) => {
        const { target } = e;

        const actived = target.closest('ul').querySelector('.active');
        if (actived) actived.classList.remove('active');

        target.classList.add('active');
        selected.innerHTML = target.innerHTML;
      });
    });
  }
}