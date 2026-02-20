import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "no-reply@notifications.ansut.ci";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SupportedLanguage = 'fr' | 'en' | 'pt' | 'ar';

interface InvitationRequest {
  focalPointId: string;
  language?: SupportedLanguage;
}

// Email templates for each language
const emailTemplates = {
  fr: {
    subject: (countryName: string) => `Invitation Point Focal UDC - ${countryName}`,
    greeting: (firstName: string) => `Cher/Chère ${firstName},`,
    body: (designationType: string, countryName: string) => 
      `L'USF Universal Digital Connect (UDC) vous a désigné(e) comme point focal ${designationType === 'primary' ? 'principal' : 'secondaire'} pour ${countryName} sur la plateforme UDC.`,
    roleDescription: `Votre rôle sera de saisir et valider les données du Fonds de Service Universel (FSU) de votre pays. Cette responsabilité est essentielle pour assurer la transparence et la coordination des initiatives FSU à travers le continent africain.`,
    cta: "Activer mon compte",
    expiry: (date: string) => `Cette invitation expire le ${date}.`,
    contact: "Pour toute question, contactez-nous à",
    footer: "USF Universal Digital Connect",
    regards: "Cordialement,",
    team: "L'équipe UDC"
  },
  en: {
    subject: (countryName: string) => `UDC Focal Point Invitation - ${countryName}`,
    greeting: (firstName: string) => `Dear ${firstName},`,
    body: (designationType: string, countryName: string) => 
      `The USF Universal Digital Connect (UDC) has designated you as the ${designationType === 'primary' ? 'primary' : 'secondary'} focal point for ${countryName} on the UDC platform.`,
    roleDescription: `Your role will be to enter and validate Universal Service Fund (USF) data for your country. This responsibility is essential to ensure transparency and coordination of USF initiatives across the African continent.`,
    cta: "Activate my account",
    expiry: (date: string) => `This invitation expires on ${date}.`,
    contact: "For any questions, contact us at",
    footer: "USF Universal Digital Connect",
    regards: "Best regards,",
    team: "The UDC Team"
  },
  pt: {
    subject: (countryName: string) => `Convite Ponto Focal UDC - ${countryName}`,
    greeting: (firstName: string) => `Caro/Cara ${firstName},`,
    body: (designationType: string, countryName: string) => 
      `A USF Universal Digital Connect (UDC) designou-o(a) como ponto focal ${designationType === 'primary' ? 'principal' : 'secundário'} para ${countryName} na plataforma UDC.`,
    roleDescription: `O seu papel será introduzir e validar os dados do Fundo de Serviço Universal (FSU) do seu país. Esta responsabilidade é essencial para garantir a transparência e a coordenação das iniciativas FSU em todo o continente africano.`,
    cta: "Ativar minha conta",
    expiry: (date: string) => `Este convite expira em ${date}.`,
    contact: "Para qualquer questão, contacte-nos em",
    footer: "USF Universal Digital Connect",
    regards: "Com os melhores cumprimentos,",
    team: "A Equipa UDC"
  },
  ar: {
    subject: (countryName: string) => `UDC دعوة نقطة الاتصال - ${countryName}`,
    greeting: (firstName: string) => `عزيزي/عزيزتي ${firstName}،`,
    body: (designationType: string, countryName: string) => 
      `قامت USF Universal Digital Connect (UDC) بتعيينك كنقطة اتصال ${designationType === 'primary' ? 'رئيسية' : 'ثانوية'} لـ ${countryName} على منصة UDC.`,
    roleDescription: `سيكون دورك هو إدخال والتحقق من صحة بيانات صندوق الخدمة الشاملة (FSU) لبلدك. هذه المسؤولية ضرورية لضمان الشفافية والتنسيق لمبادرات FSU عبر القارة الأفريقية.`,
    cta: "تفعيل حسابي",
    expiry: (date: string) => `تنتهي هذه الدعوة في ${date}.`,
    contact: "لأي استفسار، اتصل بنا على",
    footer: "USF Universal Digital Connect",
    regards: "مع أطيب التحيات،",
    team: "UDC فريق"
  }
};

function generateEmailHtml(
  template: typeof emailTemplates.fr,
  firstName: string,
  lastName: string,
  countryName: string,
  designationType: string,
  activationUrl: string,
  expiryDate: string,
  isRtl: boolean
): string {
  const direction = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'right' : 'left';
  
  return `
<!DOCTYPE html>
<html lang="${isRtl ? 'ar' : 'en'}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject(countryName)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; direction: ${direction};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">UDC</h1>
              <p style="color: #a3c9e8; margin: 8px 0 0; font-size: 14px;">${template.footer}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px; text-align: ${textAlign};">
              <p style="color: #333333; font-size: 18px; margin: 0 0 20px; font-weight: 500;">
                ${template.greeting(firstName)}
              </p>
              
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                ${template.body(designationType, countryName)}
              </p>
              
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                ${template.roleDescription}
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${activationUrl}" style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #e8b923 100%); color: #1e3a5f; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(201, 162, 39, 0.3);">
                      ${template.cta}
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #888888; font-size: 14px; margin: 30px 0 0; text-align: center;">
                ${template.expiry(expiryDate)}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #555555; font-size: 14px; margin: 0 0 10px;">
                ${template.regards}<br>
                <strong>${template.team}</strong>
              </p>
              <p style="color: #888888; font-size: 12px; margin: 15px 0 0;">
                ${template.contact} <a href="mailto:contact@uat.africa" style="color: #2d5a87;">contact@uat.africa</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { focalPointId, language = 'fr' }: InvitationRequest = await req.json();

    if (!focalPointId) {
      throw new Error("focalPointId is required");
    }

    // Fetch focal point data
    const { data: focalPoint, error: fpError } = await supabase
      .from('focal_points')
      .select('*, countries!focal_points_country_code_fkey(name_fr, name_en)')
      .eq('id', focalPointId)
      .single();

    if (fpError || !focalPoint) {
      throw new Error(`Focal point not found: ${fpError?.message}`);
    }

    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    // Update focal point with invitation data
    const { error: updateError } = await supabase
      .from('focal_points')
      .update({
        status: 'invited',
        invitation_token: invitationToken,
        invitation_sent_at: new Date().toISOString(),
        invitation_expires_at: expiresAt.toISOString()
      })
      .eq('id', focalPointId);

    if (updateError) {
      throw new Error(`Failed to update focal point: ${updateError.message}`);
    }

    // Create invitation record
    const { error: invitationError } = await supabase
      .from('focal_point_invitations')
      .insert({
        focal_point_id: focalPointId,
        email: focalPoint.email,
        token: invitationToken,
        status: 'sent',
        sent_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      });

    if (invitationError) {
      console.error("Failed to create invitation record:", invitationError);
      // Continue anyway, the main update succeeded
    }

    // Get country name based on language
    const countryName = language === 'en' 
      ? focalPoint.countries?.name_en 
      : focalPoint.countries?.name_fr || focalPoint.country_code;

    // Get the appropriate template
    const template = emailTemplates[language] || emailTemplates.fr;
    const isRtl = language === 'ar';

    // Generate activation URL
    const baseUrl = "https://wsbawdvqfbmtjtdtyddy.lovable.app";
    const activationUrl = `${baseUrl}/activate-focal-point?token=${invitationToken}`;

    // Format expiry date
    const expiryDateFormatted = expiresAt.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 
      language === 'pt' ? 'pt-PT' : 
      language === 'en' ? 'en-GB' : 'fr-FR',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );

    // Generate email HTML
    const emailHtml = generateEmailHtml(
      template,
      focalPoint.first_name,
      focalPoint.last_name,
      countryName,
      focalPoint.designation_type,
      activationUrl,
      expiryDateFormatted,
      isRtl
    );

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: `UDC Platform <${fromEmail}>`,
      to: [focalPoint.email],
      subject: template.subject(countryName),
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation sent successfully",
        emailId: emailResponse.id,
        expiresAt: expiresAt.toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-focal-point-invitation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
