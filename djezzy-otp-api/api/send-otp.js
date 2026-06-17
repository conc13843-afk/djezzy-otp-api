// api/send-otp.js
const axios = require('axios');

module.exports = async (req, res) => {
    // السماح بطلبات الـ POST فقط
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
    }

    // تهيئة الرقم ليناسب صيغة جيزي (مثال: 077XXXXXXX أو 21377XXXXXXX)
    // جيزي اب غالباً تطلب الرقم يبدأ بـ 7 ديريكت أو 07
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('213')) {
        formattedPhone = '0' + formattedPhone.slice(3);
    }

    try {
        // الـ Request الموجه لـ API جيزي (تختلف الـ Headers والروابط حسب تحديثات التطبيق)
        const response = await axios.post('https://api.djezzy.dz/api/v1/auth/otp', {
            mobile: formattedPhone
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Djezzy/Android App', // هادي مهمة بزاف باش كلخو للسيرفر باللي رانا من التيليفون
                'Accept': 'application/json'
            },
            timeout: 10000 // 10 ثواني كحد أقصى
        });

        // إذا نجح الطلب ولحق الـ OTP
        return res.status(200).json({ success: true, message: 'تم إرسال الكود بنجاح' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            error: 'فشل في إرسال الـ OTP، سيرفر جيزي قد يكون قام بتغيير الـ Endpoint أو الحماية' 
        });
    }
};