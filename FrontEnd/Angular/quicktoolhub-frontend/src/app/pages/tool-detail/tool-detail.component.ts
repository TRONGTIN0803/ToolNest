import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolDefinition } from '../../core/models/tool.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolService } from '../../core/services/tool.service';
import { ToastService } from '../../core/services/toast.service';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';

type GameNameStyle = 'cool' | 'japanese' | 'fantasy' | 'cyberpunk' | 'dark' | 'cute' | 'minimal';
type GameNameLength = 'short' | 'medium' | 'long';
type GameNameFormat = 'plain' | 'compound' | 'number' | 'separator';
type CryptoMode = 'encrypt' | 'decrypt';
type CryptoAlgorithm = 'AES-GCM' | 'AES-CBC';
type CryptoEncoding = 'base64' | 'hex';
type CryptoTextEncoding = 'utf-8' | 'base64' | 'hex';

interface GameNamePart {
  text: string;
  meaning: string;
  vibe: string;
}

interface GameNameResult {
  name: string;
  meaning: string;
  vibe: string;
  pronunciation: string;
  variants: string[];
}

const GAME_USERNAME_FAVORITES_KEY = 'qth_game_username_favorites';
const WORD_COUNTER_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'was',
  'were',
  'with',
  'you',
  'your',
]);

const GAME_NAME_BANK: Record<GameNameStyle, GameNamePart[]> = {
  cool: [
    { text: 'Vex', meaning: 'restless energy', vibe: 'sharp' },
    { text: 'Rift', meaning: 'split between worlds', vibe: 'mysterious' },
    { text: 'Axel', meaning: 'driving force', vibe: 'bold' },
    { text: 'Blaze', meaning: 'fire and speed', vibe: 'aggressive' },
    { text: 'Nyx', meaning: 'night', vibe: 'clean' },
    { text: 'Rogue', meaning: 'independent fighter', vibe: 'solo' },
  ],
  japanese: [
    { text: 'Kuro', meaning: 'black', vibe: 'dark' },
    { text: 'Sora', meaning: 'sky', vibe: 'open' },
    { text: 'Tsuki', meaning: 'moon', vibe: 'mystic' },
    { text: 'Kage', meaning: 'shadow', vibe: 'stealth' },
    { text: 'Ryu', meaning: 'dragon', vibe: 'powerful' },
    { text: 'Hikari', meaning: 'light', vibe: 'heroic' },
    { text: 'Yoru', meaning: 'night', vibe: 'quiet' },
    { text: 'Akai', meaning: 'red', vibe: 'fierce' },
    { text: 'Takuto', meaning: 'crafted modern name', vibe: 'anime-inspired' },
    { text: 'Ren', meaning: 'lotus or refined', vibe: 'minimal' },
  ],
  fantasy: [
    { text: 'Eld', meaning: 'ancient', vibe: 'mythic' },
    { text: 'Astra', meaning: 'stars', vibe: 'celestial' },
    { text: 'Vale', meaning: 'hidden valley', vibe: 'soft' },
    { text: 'Draven', meaning: 'dark wanderer', vibe: 'epic' },
    { text: 'Rune', meaning: 'magic mark', vibe: 'arcane' },
    { text: 'Thorn', meaning: 'wild defense', vibe: 'ranger' },
  ],
  cyberpunk: [
    { text: 'Neo', meaning: 'new signal', vibe: 'clean tech' },
    { text: 'Byte', meaning: 'digital unit', vibe: 'hacker' },
    { text: 'Glitch', meaning: 'broken signal', vibe: 'edgy' },
    { text: 'Chrome', meaning: 'metal shine', vibe: 'futuristic' },
    { text: 'Zero', meaning: 'blank origin', vibe: 'minimal' },
    { text: 'Circuit', meaning: 'electric path', vibe: 'technical' },
  ],
  dark: [
    { text: 'Noct', meaning: 'night', vibe: 'ominous' },
    { text: 'Grim', meaning: 'severe fate', vibe: 'heavy' },
    { text: 'Ash', meaning: 'after fire', vibe: 'cold' },
    { text: 'Mourn', meaning: 'quiet grief', vibe: 'gothic' },
    { text: 'Shade', meaning: 'shadow form', vibe: 'stealth' },
    { text: 'Void', meaning: 'empty space', vibe: 'cosmic' },
  ],
  cute: [
    { text: 'Mochi', meaning: 'soft rice cake', vibe: 'sweet' },
    { text: 'Piko', meaning: 'tiny spark', vibe: 'playful' },
    { text: 'Lumi', meaning: 'glow', vibe: 'soft' },
    { text: 'Neko', meaning: 'cat', vibe: 'cute' },
    { text: 'Bibi', meaning: 'small bright sound', vibe: 'friendly' },
    { text: 'Mimi', meaning: 'gentle sound', vibe: 'light' },
  ],
  minimal: [
    { text: 'Ren', meaning: 'refined', vibe: 'clean' },
    { text: 'Kai', meaning: 'sea or shell', vibe: 'short' },
    { text: 'Zen', meaning: 'calm focus', vibe: 'quiet' },
    { text: 'Lux', meaning: 'light', vibe: 'sharp' },
    { text: 'Ori', meaning: 'origin', vibe: 'simple' },
    { text: 'Nox', meaning: 'night', vibe: 'compact' },
  ],
};

@Component({
  selector: 'app-tool-detail',
  imports: [FormsModule, RouterLink, ToolCardComponent],
  templateUrl: './tool-detail.component.html',
})
export class ToolDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly tool = signal<ToolDefinition | undefined>(undefined);
  readonly relatedTools = signal<ToolDefinition[]>([]);
  readonly textInput = signal('Quick tools should be simple, fast, and useful.');
  readonly convertedText = signal('');
  readonly jsonError = signal('');
  readonly password = signal('');
  readonly passwordLength = signal(16);
  readonly includeUppercase = signal(true);
  readonly includeNumbers = signal(true);
  readonly includeSymbols = signal(true);
  readonly birthDate = signal('2000-01-01');
  readonly compareDate = signal(new Date().toISOString().slice(0, 10));
  readonly phoneCountry = signal<'us' | 'uk' | 'vn' | 'au'>('us');
  readonly phoneCount = signal(8);
  readonly generatedPhones = signal<string[]>([]);
  readonly wheelOptions = signal('Design review\nWrite tests\nRefactor CSS\nShip feature');
  readonly wheelResult = signal('');
  readonly wheelSpinning = signal(false);
  readonly wheelRotation = signal(0);
  readonly wheelWinner = signal('');
  readonly winnerDialogOpen = signal(false);
  readonly wheelEntries = computed(() =>
    this.wheelOptions()
      .split('\n')
      .map((option) => option.trim())
      .filter(Boolean),
  );
  readonly wheelBackground = computed(() => {
    const entries = this.wheelEntries();
    if (!entries.length) {
      return 'conic-gradient(#e4e4e7 0deg 360deg)';
    }

    const colors = ['#245f46', '#d7ff7a', '#173f35', '#f2c94c', '#4f8f73', '#e8f0db', '#111827', '#9cc9b2'];
    const segment = 360 / entries.length;

    return `conic-gradient(${entries
      .map((_, index) => `${colors[index % colors.length]} ${index * segment}deg ${(index + 1) * segment}deg`)
      .join(', ')})`;
  });
  readonly gameNameStyle = signal<GameNameStyle>('japanese');
  readonly gameNameUseCase = signal('Game character');
  readonly gameNameLength = signal<GameNameLength>('medium');
  readonly gameNameFormat = signal<GameNameFormat>('compound');
  readonly gameNameKeyword = signal('');
  readonly gameNameResults = signal<GameNameResult[]>([]);
  readonly gameNameFavorites = signal<GameNameResult[]>(this.loadGameNameFavorites());
  readonly cryptoMode = signal<CryptoMode>('encrypt');
  readonly cryptoAlgorithm = signal<CryptoAlgorithm>('AES-GCM');
  readonly cryptoInput = signal('Admin123!');
  readonly cryptoPassphrase = signal('tinptAdmin@2026#1q2w3E*');
  readonly cryptoSalt = signal('');
  readonly cryptoIv = signal('');
  readonly cryptoIterations = signal(100000);
  readonly cryptoOutputEncoding = signal<CryptoEncoding>('base64');
  readonly cryptoPlaintextEncoding = signal<CryptoTextEncoding>('utf-8');
  readonly cryptoOutput = signal('');
  readonly cryptoError = signal('');

  readonly wordStats = computed(() => {
    const text = this.textInput();
    const trimmed = text.trim();
    const wordMatches = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const totalWordLength = wordMatches.reduce((sum, word) => sum + word.length, 0);
    const longestWord = wordMatches.reduce((longest, word) => (word.length > longest.length ? word : longest), '');
    const keywordCounts = wordMatches
      .filter((word) => word.length > 2 && !WORD_COUNTER_STOP_WORDS.has(word))
      .reduce((counts, word) => counts.set(word, (counts.get(word) ?? 0) + 1), new Map<string, number>());

    return {
      words,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      sentences: trimmed ? (trimmed.match(/[.!?]+/g) ?? [trimmed]).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
      readingTimeMinutes: words ? Math.max(1, Math.ceil(words / 200)) : 0,
      averageWordLength: wordMatches.length ? Math.round((totalWordLength / wordMatches.length) * 10) / 10 : 0,
      longestWord: longestWord || 'None',
      keywordDensity: Array.from(keywordCounts.entries())
        .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
        .slice(0, 5)
        .map(([word, count]) => ({
          word,
          count,
          percentage: words ? Math.round((count / words) * 1000) / 10 : 0,
        })),
    };
  });

  readonly qrUrl = computed(() => {
    const value = encodeURIComponent(this.textInput() || 'https://quicktoolhub.com');
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${value}`;
  });

  readonly markdownPreview = computed(() => this.renderMarkdown(this.textInput()));
  readonly ageResult = computed(() => this.calculateAge());

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.toolService.getToolBySlug(slug).subscribe((tool) => {
        this.tool.set(tool);
        this.convertedText.set('');
        this.jsonError.set('');

        if (tool) {
          this.seo.updateMeta(
            `${tool.name} - free online tool`,
            `${tool.description} Use this ${tool.keyword} tool for free in your browser.`,
            { path: `/tools/${tool.slug}` },
          );
          this.toolService.getRelatedTools(tool).subscribe((items) => this.relatedTools.set(items));
          if (tool.slug === 'password-generator') {
            this.generatePassword();
          }
          if (tool.slug === 'markdown-preview') {
            this.textInput.set('# Markdown preview\n\nWrite **bold text**, lists, links, and code.');
          }
          if (tool.slug === 'phone-number-generator') {
            this.generatePhoneNumbers();
          }
          if (tool.slug === 'game-username-generator') {
            this.generateGameNames();
          }
          if (tool.slug === 'encrypt-decrypt') {
            this.generateCryptoSalt();
            this.generateCryptoIv();
          }
        }
      });
    });
  }

  convertCase(type: 'upper' | 'lower' | 'title' | 'sentence' | 'slug'): void {
    const text = this.textInput();
    const result = {
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      title: text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
      sentence: text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase()),
      slug: text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }[type];
    this.convertedText.set(result);
  }

  formatJson(minify = false): void {
    try {
      const parsed = JSON.parse(this.textInput());
      this.convertedText.set(JSON.stringify(parsed, null, minify ? 0 : 2));
      this.jsonError.set('');
    } catch (error) {
      this.jsonError.set(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }

  convertBase64(mode: 'encode' | 'decode'): void {
    try {
      const result = mode === 'encode' ? btoa(unescape(encodeURIComponent(this.textInput()))) : decodeURIComponent(escape(atob(this.textInput())));
      this.convertedText.set(result);
      this.jsonError.set('');
    } catch {
      this.jsonError.set('The input is not valid Base64.');
    }
  }

  convertUrl(mode: 'encode' | 'decode'): void {
    try {
      this.convertedText.set(mode === 'encode' ? encodeURIComponent(this.textInput()) : decodeURIComponent(this.textInput()));
      this.jsonError.set('');
    } catch {
      this.jsonError.set('The input is not a valid encoded URL string.');
    }
  }

  generatePassword(): void {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (this.includeUppercase()) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (this.includeNumbers()) chars += '0123456789';
    if (this.includeSymbols()) chars += '!@#$%^&*()_+-=[]{}';

    const length = Math.max(6, Math.min(64, Number(this.passwordLength()) || 16));
    let output = '';
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    for (const value of values) {
      output += chars[value % chars.length];
    }

    this.password.set(output);
  }

  async copy(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.toast.success('Copied to clipboard');
    } catch {
      this.toast.error('Could not copy text');
    }
  }

  generatePhoneNumbers(): void {
    const count = Math.max(1, Math.min(50, Number(this.phoneCount()) || 8));
    const phones = Array.from({ length: count }, () => this.generatePhoneNumber(this.phoneCountry()));
    this.generatedPhones.set(phones);
  }

  spinWheel(): void {
    const options = this.wheelEntries();

    if (!options.length) {
      this.wheelResult.set('Add at least one entry.');
      return;
    }

    if (this.wheelSpinning()) {
      return;
    }

    this.wheelSpinning.set(true);
    this.wheelResult.set('');
    this.wheelWinner.set('');
    this.winnerDialogOpen.set(false);

    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const winnerIndex = values[0] % options.length;
    const segment = 360 / options.length;
    const winnerCenter = winnerIndex * segment + segment / 2;
    const extraSpins = 5 + (values[0] % 4);
    const targetRotation = this.wheelRotation() + extraSpins * 360 + (360 - winnerCenter);

    this.wheelRotation.set(targetRotation);

    window.setTimeout(() => {
      const winner = options[winnerIndex];
      this.wheelResult.set(winner);
      this.wheelWinner.set(winner);
      this.wheelSpinning.set(false);
      this.winnerDialogOpen.set(true);
    }, 3600);
  }

  removeWheelWinner(): void {
    const winner = this.wheelWinner();
    if (!winner) {
      this.winnerDialogOpen.set(false);
      return;
    }

    const remaining = this.wheelEntries().filter((entry) => entry !== winner);
    this.wheelOptions.set(remaining.join('\n'));
    this.winnerDialogOpen.set(false);
    this.wheelWinner.set('');
    this.wheelResult.set('');
  }

  wheelLabelTransform(index: number): string {
    const entries = this.wheelEntries();
    if (!entries.length) {
      return '';
    }

    const angle = index * (360 / entries.length) + 360 / entries.length / 2;
    return `translate(-50%, -50%) rotate(${angle}deg) translateY(-6.9rem) rotate(90deg)`;
  }

  wheelLabelColor(index: number): string {
    const darkSegments = [0, 2, 6];
    return darkSegments.includes(index % 8) ? '#ffffff' : '#173f35';
  }

  generateGameNames(): void {
    const style = this.gameNameStyle();
    const bank = GAME_NAME_BANK[style];
    const count = 10;
    const results: GameNameResult[] = [];
    const used = new Set<string>();

    while (results.length < count && used.size < 100) {
      const first = this.pickNamePart(bank);
      const second = this.pickNamePart(bank.filter((part) => part.text !== first.text));
      const name = this.formatGameName(first, second);

      if (used.has(name)) {
        used.add(`${name}_${used.size}`);
        continue;
      }

      used.add(name);
      results.push({
        name,
        meaning: this.gameNameMeaning(first, second),
        vibe: this.gameNameVibe(style, first, second),
        pronunciation: this.pronounceGameName(name),
        variants: this.createGameNameVariants(name),
      });
    }

    this.gameNameResults.set(results);
  }

  toggleGameNameFavorite(result: GameNameResult): void {
    const exists = this.gameNameFavorites().some((item) => item.name === result.name);
    const favorites = exists
      ? this.gameNameFavorites().filter((item) => item.name !== result.name)
      : [result, ...this.gameNameFavorites()].slice(0, 20);

    this.gameNameFavorites.set(favorites);
    localStorage.setItem(GAME_USERNAME_FAVORITES_KEY, JSON.stringify(favorites));
  }

  isGameNameFavorite(name: string): boolean {
    return this.gameNameFavorites().some((item) => item.name === name);
  }

  generateCryptoSalt(): void {
    this.cryptoSalt.set(this.bytesToHex(crypto.getRandomValues(new Uint8Array(16))));
  }

  generateCryptoIv(): void {
    const length = this.cryptoAlgorithm() === 'AES-GCM' ? 12 : 16;
    this.cryptoIv.set(this.bytesToHex(crypto.getRandomValues(new Uint8Array(length))));
  }

  async runCryptoTool(): Promise<void> {
    this.cryptoError.set('');
    this.cryptoOutput.set('');

    try {
      const salt = this.toArrayBuffer(this.decodeByEncoding(this.cryptoSalt(), 'hex'));
      const iv = this.toArrayBuffer(this.decodeByEncoding(this.cryptoIv(), 'hex'));
      const key = await this.deriveAesKey(this.cryptoPassphrase(), salt, this.cryptoAlgorithm());

      if (this.cryptoMode() === 'encrypt') {
        const plaintext = this.toArrayBuffer(this.encodeInputText(this.cryptoInput(), this.cryptoPlaintextEncoding()));
        const encrypted = await crypto.subtle.encrypt({ name: this.cryptoAlgorithm(), iv }, key, plaintext);
        this.cryptoOutput.set(this.encodeByEncoding(new Uint8Array(encrypted), this.cryptoOutputEncoding()));
        return;
      }

      const ciphertext = this.toArrayBuffer(this.decodeByEncoding(this.cryptoInput(), this.cryptoOutputEncoding()));
      const decrypted = await crypto.subtle.decrypt({ name: this.cryptoAlgorithm(), iv }, key, ciphertext);
      this.cryptoOutput.set(this.decodeOutputText(new Uint8Array(decrypted), this.cryptoPlaintextEncoding()));
    } catch (error) {
      this.cryptoError.set(error instanceof Error ? error.message : 'Could not run encryption or decryption with these settings.');
    }
  }

  private calculateAge(): string {
    const start = new Date(this.birthDate());
    const end = new Date(this.compareDate());
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return 'Choose valid dates to calculate age.';
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} years, ${months} months, ${days} days`;
  }

  private generatePhoneNumber(country: 'us' | 'uk' | 'vn' | 'au'): string {
    const randomDigits = (length: number) => Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

    if (country === 'uk') {
      return `+44 7${randomDigits(3)} ${randomDigits(6)}`;
    }

    if (country === 'vn') {
      const prefixes = ['032', '033', '034', '035', '036', '037', '038', '039', '070', '076', '077', '078', '079', '090', '091'];
      return `+84 ${prefixes[Math.floor(Math.random() * prefixes.length)].slice(1)} ${randomDigits(3)} ${randomDigits(4)}`;
    }

    if (country === 'au') {
      return `+61 4${randomDigits(2)} ${randomDigits(3)} ${randomDigits(3)}`;
    }

    return `+1 (${200 + Math.floor(Math.random() * 700)}) ${200 + Math.floor(Math.random() * 700)}-${randomDigits(4)}`;
  }

  private pickNamePart(bank: GameNamePart[]): GameNamePart {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return bank[values[0] % bank.length];
  }

  private formatGameName(first: GameNamePart, second: GameNamePart): string {
    const keyword = this.toNameToken(this.gameNameKeyword());
    const parts = this.gameNameLength() === 'short' ? [first.text] : [first.text, second.text];
    if (this.gameNameLength() === 'long') {
      parts.push(keyword || this.pickNamePart(GAME_NAME_BANK[this.gameNameStyle()]).text);
    } else if (keyword) {
      parts[Math.floor(Math.random() * parts.length)] = keyword;
    }

    const base = parts.join('');

    if (this.gameNameFormat() === 'number') {
      return `${base}${10 + Math.floor(Math.random() * 90)}`;
    }

    if (this.gameNameFormat() === 'separator') {
      return parts.join('_');
    }

    if (this.gameNameFormat() === 'plain') {
      return parts[0];
    }

    return base;
  }

  private gameNameMeaning(first: GameNamePart, second: GameNamePart): string {
    if (this.gameNameLength() === 'short' || this.gameNameFormat() === 'plain') {
      return first.meaning;
    }

    return `${first.meaning} + ${second.meaning}`;
  }

  private gameNameVibe(style: GameNameStyle, first: GameNamePart, second: GameNamePart): string {
    return `${style}, ${first.vibe}, ${second.vibe}, ${this.gameNameUseCase().toLowerCase()}`;
  }

  private pronounceGameName(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  private createGameNameVariants(name: string): string[] {
    const compact = name.replace(/_/g, '');
    const suffix = Math.floor(10 + Math.random() * 90);
    return [
      compact,
      `${compact}${suffix}`,
      `x${compact}`,
      `${compact}X`,
      `${compact}_gg`,
      `${compact}Kai`,
    ];
  }

  private toNameToken(value: string): string {
    return value
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 14)
      .replace(/^\w/, (char) => char.toUpperCase());
  }

  private loadGameNameFavorites(): GameNameResult[] {
    try {
      return JSON.parse(localStorage.getItem(GAME_USERNAME_FAVORITES_KEY) ?? '[]') as GameNameResult[];
    } catch {
      return [];
    }
  }

  private async deriveAesKey(passphrase: string, salt: ArrayBuffer, algorithm: CryptoAlgorithm): Promise<CryptoKey> {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: Math.max(1, Number(this.cryptoIterations()) || 100000),
        hash: 'SHA-256',
      },
      baseKey,
      {
        name: algorithm,
        length: 256,
      },
      false,
      algorithm === 'AES-GCM' ? ['encrypt', 'decrypt'] : ['encrypt', 'decrypt'],
    );
  }

  private encodeInputText(value: string, encoding: CryptoTextEncoding): Uint8Array {
    if (encoding === 'base64') {
      return this.decodeByEncoding(value, 'base64');
    }

    if (encoding === 'hex') {
      return this.decodeByEncoding(value, 'hex');
    }

    return new TextEncoder().encode(value);
  }

  private decodeOutputText(bytes: Uint8Array, encoding: CryptoTextEncoding): string {
    if (encoding === 'base64') {
      return this.bytesToBase64(bytes);
    }

    if (encoding === 'hex') {
      return this.bytesToHex(bytes);
    }

    return new TextDecoder().decode(bytes);
  }

  private encodeByEncoding(bytes: Uint8Array, encoding: CryptoEncoding): string {
    return encoding === 'hex' ? this.bytesToHex(bytes) : this.bytesToBase64(bytes);
  }

  private decodeByEncoding(value: string, encoding: CryptoEncoding): Uint8Array {
    const clean = value.trim();
    if (!clean) {
      throw new Error('Salt, IV, key, and input values are required.');
    }

    if (encoding === 'hex') {
      return this.hexToBytes(clean);
    }

    return this.base64ToBytes(clean);
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  }

  private base64ToBytes(value: string): Uint8Array {
    const binary = atob(value);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private hexToBytes(value: string): Uint8Array {
    const clean = value.replace(/\s/g, '');
    if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) {
      throw new Error('Hex values must use valid pairs of 0-9 and A-F characters.');
    }

    return Uint8Array.from(clean.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16));
  }

  private toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    return buffer;
  }

  private renderMarkdown(markdown: string): string {
    const escaped = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  }
}
