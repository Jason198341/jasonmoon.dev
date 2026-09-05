/**
 * 쓰기 잠금 게이트.
 * 읽기는 누구나. 쓰기(기록·글·업로드)만 패스코드로 연다.
 */
import { checkPass, getPass, setPass, isUnlocked, toast } from './db';

/**
 * 잠금 UI를 붙이고, 해제되면 onOpen()을 부른다.
 * @param host  게이트를 그릴 자리
 * @param panel 해제 시 보여줄 영역 (기본 숨김)
 */
export async function mountGate(
  host: HTMLElement,
  panel: HTMLElement,
  onOpen?: () => void,
): Promise<void> {
  const open = () => {
    host.hidden = true;
    panel.hidden = false;
    onOpen?.();
  };

  if (await isUnlocked()) { open(); return; }

  host.hidden = false;
  panel.hidden = true;
  host.innerHTML = `
    <div class="lock">
      <p style="margin:0 0 10px"><b>기록하려면 잠금을 해제하세요.</b><br>
        <span class="tiny">읽기는 잠금 없이 됩니다. 쓰기만 잠겨 있습니다.</span></p>
      <div class="row" style="max-width:380px;margin:0 auto">
        <input type="password" id="gatePass" placeholder="패스코드" autocomplete="current-password" />
        <button type="button" class="primary" id="gateGo" style="flex:0 0 auto;min-width:auto">열기</button>
      </div>
    </div>`;

  const input = host.querySelector<HTMLInputElement>('#gatePass')!;
  const go = host.querySelector<HTMLButtonElement>('#gateGo')!;

  const submit = async () => {
    const v = input.value.trim();
    if (!v) return;
    go.disabled = true;
    try {
      if (await checkPass(v)) {
        setPass(v);
        toast('열렸습니다');
        open();
      } else {
        toast('패스코드가 다릅니다');
        input.select();
      }
    } catch (e) {
      toast('연결 실패: ' + (e as Error).message);
    } finally {
      go.disabled = false;
    }
  };

  go.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
}

export { getPass };
