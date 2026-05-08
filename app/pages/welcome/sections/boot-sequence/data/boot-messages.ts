export type BootMessageType = "info" | "system" | "success" | "warning" | "error";

export interface BootMessage {
  text: string;
  type: BootMessageType;
}

export const bootMessages: BootMessage[] = [
  {
    text: "[ 0.000000] Linux version 6.1.0-arch1-1 (linux@archlinux) (gcc (GCC) 12.2.0, GNU ld (GNU Binutils) 2.39.0)",
    type: "info",
  },
  {
    text: "[ 0.000000] Command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=12345678-1234-1234-1234-123456789abc rw quiet",
    type: "system",
  },
  { text: "[ 0.000000] KERNEL supported cpus:", type: "system" },
  { text: "[ 0.000000]   Intel GenuineIntel", type: "system" },
  { text: "[ 0.000000]   AMD AuthenticAMD", type: "system" },
  {
    text: "[ 0.001234] x86/fpu: Supporting XSAVE feature 0x001: FP",
    type: "info",
  },
  {
    text: "[ 0.001235] x86/fpu: Supporting XSAVE feature 0x002: SSE",
    type: "info",
  },
  {
    text: "[ 0.001236] x86/fpu: Supporting XSAVE feature 0x004: YMM",
    type: "info",
  },
  { text: "[ 0.002456] BIOS-provided physical RAM map:", type: "info" },
  {
    text: "[ 0.002457] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
    type: "system",
  },
  {
    text: "[ 0.002458] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved",
    type: "system",
  },
  {
    text: "[ 0.003123] NX (Execute Disable) protection: active",
    type: "success",
  },
  {
    text: "[ 0.004567] DMI: System manufacturer System Product Name/PRIME B450M-A, BIOS 3602 12/18/2020",
    type: "info",
  },
  { text: "[ 0.867890] smp: Brought up 1 node, 12 CPUs", type: "success" },
  { text: "[ 0.878901] smpboot: Max logical packages: 1", type: "info" },
  {
    text: "[ 0.889012] smpboot: Total of 12 processors activated (86400.00 BogoMIPS)",
    type: "success",
  },
  { text: "[ 0.890123] devtmpfs: initialized", type: "success" },
  { text: "[ 0.901234] x86/mm: Memory block size: 128MB", type: "info" },
  {
    text: "[ 0.912345] PM: hibernation: Registering snapshot device at major 10",
    type: "info",
  },
  {
    text: "[ 0.923456] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff",
    type: "info",
  },
  {
    text: "[ 0.934567] futex hash table entries: 4096 (order: 6, 262144 bytes, linear)",
    type: "info",
  },
  {
    text: "[ 0.945678] pinctrl core: initialized pinctrl subsystem",
    type: "success",
  },
  {
    text: "[ 0.956789] PM: RTC time: 12:34:56, date: 2024/01/15",
    type: "info",
  },
  { text: "[ 0.967890] NET: Registered protocol family 16", type: "success" },
  {
    text: "[ 0.978901] DMA: preallocated 4096 KiB GFP_KERNEL pool for atomic allocations",
    type: "info",
  },
  {
    text: "[ 0.989012] DMA: preallocated 4096 KiB GFP_KERNEL|GFP_DMA pool for atomic allocations",
    type: "info",
  },
  {
    text: "[ 0.990123] DMA: preallocated 4096 KiB GFP_KERNEL|GFP_DMA32 pool for atomic allocations",
    type: "info",
  },
  {
    text: "[ 1.001234] audit: initializing netlink subsys (disabled)",
    type: "info",
  },
  {
    text: "[ 1.012345] audit: type=2000 audit(1642248896.013:1): state=initialized audit_enabled=0 res=1",
    type: "success",
  },
  {
    text: "[ 1.023456] thermal_sys: Registered thermal governor 'fair_share'",
    type: "success",
  },
  {
    text: "[ 1.034567] thermal_sys: Registered thermal governor 'bang_bang'",
    type: "success",
  },
  {
    text: "[ 1.045678] thermal_sys: Registered thermal governor 'step_wise'",
    type: "success",
  },
  {
    text: "[ 1.056789] thermal_sys: Registered thermal governor 'user_space'",
    type: "success",
  },
  { text: "[ 1.067890] cpuidle: using governor ladder", type: "info" },
  { text: "[ 1.078901] cpuidle: using governor menu", type: "info" },
  {
    text: "[ 1.089012] ACPI FADT declares the system doesn't support PCIe ASPM, so disable it",
    type: "warning",
  },
  { text: "[ 1.090123] ACPI: bus type PCI registered", type: "success" },
  {
    text: "[ 1.101234] acpiphp: ACPI Hot Plug PCI Controller Driver version: 0.5",
    type: "info",
  },
  { text: "[ 1.234567] System is ready", type: "success" },
];
