import { useState } from 'react';
import { Computer } from '@/components/misc/computer/computer.component';
import { MiscSettingsCard } from '@/components/misc/misc-settings-card/misc-settings-card.component';
import { Slider } from '@/components/primitives/slider/slider.component';
import {
	computerSection,
	computerSettingsInput,
	computerSettingsLabel,
	computerSettingsLabelTitle,
	computerSettingsSection,
	computerSettingsValue,
	computerWrapper3DSection,
	computerWrapperBaseSection,
} from './computer-section.css';

export function ComputerSection() {
	const [rotate, setRotate] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	const [scale, setScale] = useState(1);

	const resetTransform = () => {
		setRotate({ x: 0, y: 0, z: 0 });
		setScale(1);
	};

	const settingsGroups = [
		{
			title: 'Rotation',
			controls: [
				{
					label: 'X',
					value: rotate.x,
					min: -180,
					max: 180,
					onChange: (value: number) => setRotate({ ...rotate, x: value }),
					formatValue: (value: number) => `${value}°`,
					step: 1,
				},
				{
					label: 'Y',
					value: rotate.y,
					min: -180,
					max: 180,
					onChange: (value: number) => setRotate({ ...rotate, y: value }),
					formatValue: (value: number) => `${value}°`,
					step: 1,
				},
				{
					label: 'Z',
					value: rotate.z,
					min: -180,
					max: 180,
					onChange: (value: number) => setRotate({ ...rotate, z: value }),
					formatValue: (value: number) => `${value}°`,
					step: 1,
				},
			],
		},
		{
			title: 'Échelle',
			controls: [
				{
					label: 'Scale',
					value: scale,
					min: 0.1,
					max: 3,
					onChange: setScale,
					formatValue: (value: number) => `${value.toFixed(2)}x`,
					step: 0.1,
				},
			],
		},
	];

	return (
		<section className={computerSection}>
			<div
				className={computerWrapperBaseSection}
				style={{ transform: `scale(${scale})` }}
			>
				<div
					className={computerWrapper3DSection}
					style={{
						transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)`,
					}}
				>
					<Computer />
				</div>
			</div>

			<MiscSettingsCard title="Paramètres 3D" onReset={resetTransform}>
				{settingsGroups.map((group) => (
					<div className={computerSettingsSection} key={group.title}>
						<h3>{group.title}</h3>
						{group.controls.map((control) => (
							<div className={computerSettingsLabel} key={control.label}>
								<span className={computerSettingsLabelTitle}>
									{control.label}
								</span>
								<Slider
									className={computerSettingsInput}
									minValue={control.min}
									maxValue={control.max}
									step={control.step}
									value={control.value}
									onChange={(e) => control.onChange(e)}
								/>
								<span className={computerSettingsValue}>
									{control.formatValue(control.value)}
								</span>
							</div>
						))}
					</div>
				))}
			</MiscSettingsCard>
		</section>
	);
}
