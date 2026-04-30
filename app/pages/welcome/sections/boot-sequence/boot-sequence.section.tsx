import { createTimeline, onScroll, stagger } from "animejs";
import { useEffect } from "react";
import { Container } from "@/components/layouts/container/container.component";
import { Section } from "@/components/layouts/sections/section.component";
import * as styles from "./boot-sequence.css";

// Messages de boot Linux détaillés
const bootMessages = [
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
  // { text: '[ 0.005678] tsc: Fast TSC calibration using PIT', type: 'success' },
  // { text: '[ 0.006789] tsc: Detected 3600.000 MHz processor', type: 'info' },
  // { text: '[ 0.012345] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved', type: 'system' },
  // { text: '[ 0.023456] e820: remove [mem 0x000a0000-0x000fffff] usable', type: 'system' },
  // { text: '[ 0.034567] last_pfn = 0x830000 max_arch_pfn = 0x400000000', type: 'system' },
  // { text: '[ 0.045678] MTRR default type: write-back', type: 'info' },
  // { text: '[ 0.056789] MTRR fixed ranges enabled:', type: 'info' },
  // { text: '[ 0.067890] x86/PAT: Configuration [0-7]: WB WC UC- UC WB WP UC- WT', type: 'info' },
  // { text: '[ 0.078901] total RAM: 16777216KB', type: 'success' },
  // { text: '[ 0.089012] Zone ranges:', type: 'info' },
  // { text: '[ 0.090123]   DMA32    [mem 0x0000000000001000-0x00000000ffffffff]', type: 'system' },
  // { text: '[ 0.101234]   Normal   [mem 0x0000000100000000-0x000000082fffffff]', type: 'system' },
  // { text: '[ 0.112345] Movable zone start for each node', type: 'system' },
  // { text: '[ 0.123456] Early memory node ranges', type: 'system' },
  // { text: '[ 0.134567] Initmem setup node 0 [mem 0x0000000000001000-0x000000082fffffff]', type: 'info' },
  // { text: '[ 0.145678] On node 0 totalpages: 8388607', type: 'info' },
  // { text: '[ 0.156789] DMA32 zone: 65536 pages, LIFO batch:15', type: 'info' },
  // { text: '[ 0.167890] Normal zone: 8323071 pages, LIFO batch:63', type: 'info' },
  // { text: '[ 0.178901] ACPI: PM-Timer IO Port: 0x408', type: 'success' },
  // { text: '[ 0.189012] ACPI: Local APIC address 0xfee00000', type: 'info' },
  // { text: '[ 0.190123] ACPI: LAPIC_NMI (acpi_id[0xff] high edge lint[0x1])', type: 'info' },
  // { text: '[ 0.201234] IOAPIC[0]: apic_id 2, version 33, address 0xfec00000, GSI 0-23', type: 'info' },
  // { text: '[ 0.212345] ACPI: INT_SRC_OVR (bus 0 bus_irq 0 global_irq 2 dfl dfl)', type: 'info' },
  // { text: '[ 0.223456] ACPI: IRQ0 used by override.', type: 'system' },
  // { text: '[ 0.234567] ACPI: IRQ9 used by override.', type: 'system' },
  // { text: '[ 0.245678] Using ACPI (MADT) for SMP configuration information', type: 'success' },
  // { text: '[ 0.256789] ACPI: HPET id: 0x43538210 base: 0xfed00000', type: 'info' },
  // { text: '[ 0.267890] smpboot: Allowing 12 CPUs, 0 hotplug CPUs', type: 'success' },
  // { text: '[ 0.278901] PM: hibernation: Registered nosave memory: [mem 0x00000000-0x00000fff]', type: 'info' },
  // { text: '[ 0.289012] PM: hibernation: Registered nosave memory: [mem 0x0009fc00-0x0009ffff]', type: 'info' },
  // { text: '[ 0.290123] [mem 0x830000000-0xffffffff] available for PCI devices', type: 'info' },
  // { text: '[ 0.301234] Booting paravirtualized kernel on bare hardware', type: 'info' },
  // { text: '[ 0.312345] clocksource: refined-jiffies: mask: 0xffffffff max_cycles: 0xffffffff', type: 'info' },
  // { text: '[ 0.323456] setup_percpu: NR_CPUS:320 nr_cpumask_bits:320 nr_cpu_ids:12 nr_node_ids:1', type: 'info' },
  // { text: '[ 0.334567] percpu: Embedded 57 pages/cpu s196608 r8192 d28672 u262144', type: 'info' },
  // { text: '[ 0.345678] Built 1 zonelists, mobility grouping on. Total pages: 8388607', type: 'success' },
  // { text: '[ 0.356789] Policy zone: Normal', type: 'info' },
  // { text: '[ 0.367890] Kernel command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=12345678-1234-1234-1234-123456789abc rw quiet', type: 'info' },
  // { text: '[ 0.378901] Unknown kernel command line parameters "BOOT_IMAGE=/vmlinuz-linux", will be passed to user space.', type: 'warning' },
  // { text: '[ 0.389012] Dentry cache hash table entries: 4194304 (order: 13, 33554432 bytes, linear)', type: 'info' },
  // { text: '[ 0.390123] Inode-cache hash table entries: 2097152 (order: 12, 16777216 bytes, linear)', type: 'info' },
  // { text: '[ 0.401234] mem auto-init: stack:off, heap alloc:on, heap free:off', type: 'info' },
  // { text: '[ 0.456789] Memory: 16777216K/33554428K available (14340K kernel code, 2048K rwdata, 4096K rodata, 1664K init, 2312K bss, 16777212K reserved, 0K cma-reserved)', type: 'success' },
  // { text: '[ 0.467890] random: get_random_u64 called from kmem_cache_open+0x2e/0x270 with crng_init=0', type: 'warning' },
  // { text: '[ 0.478901] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=12, Nodes=1', type: 'info' },
  // { text: '[ 0.489012] Kernel/User page tables isolation: enabled', type: 'success' },
  // { text: '[ 0.490123] ftrace: allocating 41835 entries in 164 pages', type: 'info' },
  // { text: '[ 0.501234] ftrace: allocated 164 pages with 5 groups', type: 'success' },
  // { text: '[ 0.512345] rcu: Hierarchical RCU implementation.', type: 'info' },
  // { text: '[ 0.523456] rcu: RCU restricting CPUs from NR_CPUS=320 to nr_cpu_ids=12.', type: 'info' },
  // { text: '[ 0.534567] rcu: RCU calculated value of scheduler-enlistment delay is 30 jiffies.', type: 'info' },
  // { text: '[ 0.545678] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=12', type: 'info' },
  // { text: '[ 0.556789] NR_IRQS: 20736, nr_irqs: 488, preallocated irqs: 16', type: 'info' },
  // { text: '[ 0.567890] Console: colour dummy device 80x25', type: 'info' },
  // { text: '[ 0.578901] printk: console [tty0] enabled', type: 'success' },
  // { text: '[ 0.589012] ACPI: Core revision 20210730', type: 'info' },
  // { text: '[ 0.590123] clocksource: hpet: mask: 0xffffffff max_cycles: 0xffffffff', type: 'info' },
  // { text: '[ 0.601234] APIC: Switch to symmetric I/O mode setup', type: 'success' },
  // { text: '[ 0.612345] x2apic: IRQ remapping doesn\'t support X2APIC mode', type: 'warning' },
  // { text: '[ 0.623456] ..TIMER: vector=0x30 apic1=0 pin1=2 apic2=-1 pin2=-1', type: 'info' },
  // { text: '[ 0.634567] clocksource: tsc-early: mask: 0xffffffffffffffff max_cycles: 0x33def5a0e', type: 'info' },
  // { text: '[ 0.645678] Calibrating delay loop (skipped), value calculated using timer frequency.. ', type: 'info' },
  // { text: '[ 0.656789] pid_max: default: 32768 minimum: 301', type: 'info' },
  // { text: '[ 0.667890] LSM: Security Framework initializing', type: 'success' },
  // { text: '[ 0.678901] Mount-cache hash table entries: 65536 (order: 7, 524288 bytes, linear)', type: 'info' },
  // { text: '[ 0.689012] Mountpoint-cache hash table entries: 65536 (order: 7, 524288 bytes, linear)', type: 'info' },
  // { text: '[ 0.690123] CPU0: Thermal monitoring enabled (TM1)', type: 'success' },
  // { text: '[ 0.701234] process: using mwait in idle threads', type: 'info' },
  // { text: '[ 0.712345] Last level iTLB entries: 4KB 1024, 2MB 1024, 4MB 512', type: 'info' },
  // { text: '[ 0.723456] Last level dTLB entries: 4KB 2048, 2MB 2048, 4MB 1024, 1GB 0', type: 'info' },
  // { text: '[ 0.734567] Spectre V1 : Mitigation: usercopy/swapgs barriers and __user pointer sanitization', type: 'success' },
  // { text: '[ 0.745678] Spectre V2 : Mitigation: Retpolines', type: 'success' },
  // { text: '[ 0.756789] Spectre V2 : Spectre v2 / SpectreRSB mitigation: Filling RSB on context switch', type: 'success' },
  // { text: '[ 0.767890] Speculative Store Bypass: Mitigation: Speculative Store Bypass disabled via prctl and seccomp', type: 'success' },
  // { text: '[ 0.778901] MDS: Mitigation: Clear CPU buffers', type: 'success' },
  // { text: '[ 0.789012] Freeing SMP alternatives memory: 32K', type: 'success' },
  // { text: '[ 0.790123] smpboot: CPU0: AMD Ryzen 5 3600 6-Core Processor (family: 0x17, model: 0x71, stepping: 0x0)', type: 'info' },
  // { text: '[ 0.801234] Performance Events: Fam17h+ core perfctr, AMD PMU driver.', type: 'success' },
  // { text: '[ 0.812345] rcu: Hierarchical SRCU implementation.', type: 'info' },
  // { text: '[ 0.823456] NMI watchdog: Enabled. Permanently consumes one hw-PMU counter.', type: 'success' },
  // { text: '[ 0.834567] smp: Bringing up secondary CPUs ...', type: 'info' },
  // { text: '[ 0.845678] x86: Booting SMP configuration:', type: 'info' },
  // { text: '[ 0.856789] .... node  #0, CPUs:        #1  #2  #3  #4  #5  #6  #7  #8  #9 #10 #11', type: 'success' },
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

export function BootSequenceSection() {
  useEffect(() => {
    createTimeline({
      autoplay: onScroll({
        target: `.${styles.bootSection}`,
        enter: "top top",
        leave: "bottom bottom",
        // sync: .5,
        // debug: true,
      }),
    })
      // .add(`.${styles.bootSequence}`, {
      //   // y: ['-10rem', '0'],
      //   height: ['0', 'auto']
      // })
      .add(
        `.${styles.bootLine}`,
        {
          ease: "steps(1)",
          opacity: [0, 1],
          height: [0, "auto"],
          delay: stagger(50),
        },
        0,
      )
      .init();
  }, []);

  return (
    <Section className={styles.bootSection}>
      <Container className={styles.bootContainer}>
        <div className={styles.bootSequence}>
          {/* Lignes de boot directement affichées */}
          {bootMessages.map((message) => (
            <div
              key={message.text}
              className={`${styles.bootLine} ${styles.bootLineVisible} ${
                message.type === "error"
                  ? styles.bootLineError
                  : message.type === "success"
                    ? styles.bootLineSuccess
                    : message.type === "warning"
                      ? styles.bootLineWarning
                      : message.type === "system"
                        ? styles.bootLineSystem
                        : styles.bootLineInfo
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <span className={styles.cursor} />
      </Container>
    </Section>
  );
}
