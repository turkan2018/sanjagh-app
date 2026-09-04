const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const industrialFields = [
  'propertyType',
  'area',
  'warehouseArea',
  'structureType',
  'warehouseHeight',
  'overheadCrane',
  'craneCapacity',
  'electricityAmperage',
  'electricityPhase',
  'gasCapacity',
  'waterCapacity',
  'roadAccess',
  'licenses',
  'description'
];

function validateIndustrialListing(body = {}) {
  const errors = [];

  if (!body.propertyType) errors.push('نوع ملک الزامی است.');
  if (body.area == null || Number(body.area) <= 0) errors.push('مساحت کل باید بیشتر از صفر باشد.');
  if (body.warehouseArea != null && Number(body.warehouseArea) < 0) errors.push('مساحت سوله نمی‌تواند منفی باشد.');
  if (!body.structureType) errors.push('نوع سازه سوله الزامی است.');
  if (body.warehouseHeight != null && Number(body.warehouseHeight) < 0) errors.push('ارتفاع سوله نامعتبر است.');
  if (body.overheadCrane === true && (body.craneCapacity == null || Number(body.craneCapacity) <= 0)) {
    errors.push('در صورت وجود جرثقیل سقفی، ظرفیت جرثقیل باید ثبت شود.');
  }
  if (body.electricityAmperage != null && Number(body.electricityAmperage) < 0) errors.push('آمپراژ برق نامعتبر است.');
  if (body.gasCapacity != null && Number(body.gasCapacity) < 0) errors.push('ظرفیت گاز نامعتبر است.');
  if (body.waterCapacity != null && Number(body.waterCapacity) < 0) errors.push('ظرفیت آب نامعتبر است.');

  return errors;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'sanjagh-backend' });
});

app.get('/api/listings/industrial/schema', (_req, res) => {
  res.json({
    type: 'industrial-property',
    fields: industrialFields,
    required: ['propertyType', 'area', 'structureType'],
    aiFeatures: {
      listingTextGeneration: true,
      imageEnhancement: true,
      completenessCheck: true
    }
  });
});

app.post('/api/listings/industrial/validate', (req, res) => {
  const errors = validateIndustrialListing(req.body);
  res.status(errors.length ? 422 : 200).json({ valid: errors.length === 0, errors });
});

app.post('/api/ai/listing-draft', (req, res) => {
  const errors = validateIndustrialListing(req.body);
  if (errors.length) return res.status(422).json({ valid: false, errors });

  const b = req.body;
  const title = `${b.propertyType} ${b.area ? `با مساحت ${b.area} مترمربع` : ''}`.trim();
  const description = [
    `${b.propertyType} مناسب فروش با مساحت کل ${b.area} مترمربع.`,
    b.warehouseArea ? `مساحت سوله: ${b.warehouseArea} مترمربع.` : null,
    b.structureType ? `نوع سازه سوله: ${b.structureType}.` : null,
    b.warehouseHeight ? `ارتفاع سوله: ${b.warehouseHeight} متر.` : null,
    b.overheadCrane ? `مجهز به جرثقیل سقفی با ظرفیت ${b.craneCapacity || 'نامشخص'} تن.` : null,
    b.electricityAmperage ? `برق: ${b.electricityAmperage} آمپر${b.electricityPhase ? `، ${b.electricityPhase}` : ''}.` : null,
    b.gasCapacity ? `گاز: ${b.gasCapacity}.` : null,
    b.waterCapacity ? `آب: ${b.waterCapacity}.` : null,
    b.roadAccess ? `دسترسی: ${b.roadAccess}.` : null,
    b.licenses ? `مجوزها: ${b.licenses}.` : null,
    b.description ? `توضیحات مالک: ${b.description}` : null
  ].filter(Boolean).join(' ');

  res.json({
    title,
    description,
    note: 'این نسخه پایه تولید متن است؛ اتصال به مدل هوش مصنوعی واقعی در مرحله بعد انجام می‌شود.'
  });
});

app.listen(PORT, () => {
  console.log(`Sanjagh backend running on port ${PORT}`);
});
