/**
 * @description 공통관리 페이지 구현
 * @author 박태훈
 * @since 2022-02-04
 */

// TODO: 저장 기능 구현 필요
'use strict'; // 엄격 모드 실행

// 유효성 검사
import { setValidationStyle, vaildateRequestData, checkLimitText } from '../../util/vaildation.js';
// 초기화 function
import { initializeEzenSelect } from '../../util/initializations.js';

// 그리드
import { grid, detailGrid } from './grid/grid.js';
// API 호출
import { loadCodeListByGroup, loadChildrenCodes, loadCodeData } from './data-fetched/load-code.js';

/**
 * DOM 선택
 */
const codeDataForm = document.querySelector('#codeDataForm'); // 코드 정보 form
const saveBtn = document.querySelector('#saveBtn'); // 저장 버튼
const newBtn = document.querySelector('#newBtn'); // 신규 버튼

/**
 * 화면 로드 이후 바로 호출하는 함수
 */
setValidationStyle(saveBtn.id); // 유효성 검사가 필요한 태그 style
checkLimitText(codeDataForm.codeDesc, 60); // 글자 수 제한 style 및 기능
loadCodeListByGroup(grid); // 그룹 코드 load 및 선택한 그룹 코드에 해당하는 코드 목록 load

/**
 * 코드 목록 그리드 클릭 이벤트 정의
 */
grid.on('click', (e) => {
  const { targetType, instance, rowKey } = e; // 필요한 properties 비구조화

  if (targetType !== 'cell') return; // 유효하지 않은 row 클릭시 종료

  const row = instance.getRow(rowKey, 'codeId'); // 현재 클릭한 row

  loadChildrenCodes(detailGrid, row); // 하위 코드 그리드에 데이터 작성
  loadCodeData(codeDataForm, row); // 코드 정보 탭에 데이터 작성
});

/**
 * 저장 기능 구현
 */
saveBtn.addEventListener('click', (e) => {
  // 현재 탭에 따라 서로 다른 function 호출
  const currentTabId = document.querySelector('.tab-pane.show.active').id;
  currentTabId === 'detail-code' ? saveChildrenCode(e) : saveCodeInfo(e);
});

// 하위 코드 목록 저장
function saveChildrenCode(e) {
  console.log('하위 코드 목록');
}

// 코드 정보 저장
function saveCodeInfo(e) {
  const { target } = e;
  vaildateRequestData(target.id); // 유효성 검사 이후 저장 실행
}

/**
 * 초기화 기능 구현
 */
newBtn.addEventListener('click', () => {
  grid.resetData([]); // 그리드 초기화
  detailGrid.resetData([]); // 그리드 초기화
  codeDataForm.reset(); // 코드 정보 form 초기화
  codeDataForm.codeId.removeAttribute('readonly'); // 코드 정보 form의 readonly 삭제

  initializeEzenSelect({ codeGroup: 'MES', useYn: '1' }); // custom select 초기화
});
