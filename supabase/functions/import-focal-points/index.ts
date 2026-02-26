import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const MISSING_COUNTRIES = [
  { code: 'SD', name_fr: 'Soudan', name_en: 'Sudan', continent: 'Afrique' },
  { code: 'CG', name_fr: 'Congo-Brazzaville', name_en: 'Republic of the Congo', continent: 'Afrique' },
  { code: 'SZ', name_fr: 'Eswatini', name_en: 'Eswatini', continent: 'Afrique' },
  { code: 'LS', name_fr: 'Lesotho', name_en: 'Lesotho', continent: 'Afrique' },
  { code: 'NA', name_fr: 'Namibie', name_en: 'Namibia', continent: 'Afrique' },
  { code: 'ST', name_fr: 'Sao Tomé-et-Príncipe', name_en: 'São Tomé and Príncipe', continent: 'Afrique' },
  { code: 'CV', name_fr: 'Cabo Verde', name_en: 'Cabo Verde', continent: 'Afrique' },
  { code: 'LR', name_fr: 'Liberia', name_en: 'Liberia', continent: 'Afrique' },
  { code: 'GA', name_fr: 'Gabon', name_en: 'Gabon', continent: 'Afrique' },
  { code: 'ZW', name_fr: 'Zimbabwe', name_en: 'Zimbabwe', continent: 'Afrique' },
  { code: 'MR', name_fr: 'Mauritanie', name_en: 'Mauritania', continent: 'Afrique' },
  { code: 'GN', name_fr: 'Guinée', name_en: 'Guinea', continent: 'Afrique' },
  { code: 'GM', name_fr: 'Gambie', name_en: 'Gambia', continent: 'Afrique' },
  { code: 'BI', name_fr: 'Burundi', name_en: 'Burundi', continent: 'Afrique' },
  { code: 'CF', name_fr: 'République centrafricaine', name_en: 'Central African Republic', continent: 'Afrique' },
  { code: 'MU', name_fr: 'Maurice', name_en: 'Mauritius', continent: 'Afrique' },
  { code: 'AO', name_fr: 'Angola', name_en: 'Angola', continent: 'Afrique' },
  { code: 'TD', name_fr: 'Tchad', name_en: 'Chad', continent: 'Afrique' },
]

function cleanPhone(phone: string | null): string | null {
  if (!phone) return null
  return phone.replace(/[\s\-\(\)\"\/]+/g, '').replace(/^0+/, '')
}

const FOCAL_POINTS = [
  // 1. Sudan
  { country_code: 'SD', designation_type: 'primary', first_name: 'Saeed Addow', last_name: 'Himmaida Mohammad', email: 'saeed@tpra.gov.sd', phone: '918041066', organization: 'TPRA', job_title: 'Universal Service Project Manager' },
  { country_code: 'SD', designation_type: 'secondary', first_name: 'Zahwa', last_name: 'Eltayeb Mokhtar', email: 'zahwa.tayeb@tpra.gov.sd', phone: '12299981', organization: 'TPRA', job_title: 'Universal Service Project Administrator' },
  // 2. Congo-Brazzaville
  { country_code: 'CG', designation_type: 'primary', first_name: 'Roch Blanchard', last_name: 'OKEMBA', email: 'rochokemba@gmail.com', phone: '066414770', organization: 'Ministère des Postes, Télécommunications et de l\'Économie Numérique', job_title: 'Conseiller à la Réforme du Ministre' },
  // 3. Eswatini
  { country_code: 'SZ', designation_type: 'primary', first_name: 'Mbongeni', last_name: 'Mtshali', email: 'Mbongeni.mtshali@esccom.org.sz', phone: '76060184', organization: 'ESCCOM', job_title: 'Director: Universal Access and Service Fund' },
  // 4. Lesotho
  { country_code: 'LS', designation_type: 'primary', first_name: 'Makhabane', last_name: 'Mohale', email: 'mmohale@lca.org.ls', phone: '58867584', organization: 'LCA', job_title: 'Projects Manager / Acting USF Executive Secretary' },
  // 5. Namibia
  { country_code: 'NA', designation_type: 'primary', first_name: 'Jacobus', last_name: 'Maritz', email: 'JMaritz@cran.na', phone: '811497872', organization: 'CRAN', job_title: 'Manager: Universal Service Fund' },
  { country_code: 'NA', designation_type: 'secondary', first_name: 'Monica', last_name: 'Nangutuwala', email: 'MNangutuwala@cran.na', phone: '813084486', organization: 'CRAN', job_title: 'Manager: Analyst: Universal Access & GIS' },
  // 6. São Tomé and Príncipe
  { country_code: 'ST', designation_type: 'primary', first_name: 'Adelaide', last_name: 'Fahe', email: 'adelaide.fahe@ager.st', phone: '9024634', organization: 'AGER', job_title: null },
  { country_code: 'ST', designation_type: 'secondary', first_name: 'Irandira', last_name: 'Trovoada', email: 'irandira.trovoada@ager.st', phone: '9836958', organization: 'AGER', job_title: null },
  // 7. Senegal (4 focal points)
  { country_code: 'SN', designation_type: 'primary', first_name: 'Maty', last_name: 'Dieng LO', email: 'maty.dieng@numerique.gouv.sn', phone: '778396579', organization: 'Ministère du Numérique', job_title: null },
  { country_code: 'SN', designation_type: 'secondary', first_name: 'Mamadou', last_name: 'NDIR', email: 'mamadou.ndir@fdsut.sn', phone: '776946386', organization: 'FDSUT', job_title: null },
  { country_code: 'SN', designation_type: 'primary', first_name: 'Ousmane', last_name: 'NDIAYE', email: 'ndiaye.ousmane@artp.sn', phone: '774224222', organization: 'ARTP', job_title: null },
  // 8. Cabo Verde
  { country_code: 'CV', designation_type: 'primary', first_name: 'Josemar', last_name: 'Soares', email: 'Josemar.Soares@gov.cv', phone: '9200128', organization: 'Ministry of Digital Economy', job_title: 'Adviser' },
  { country_code: 'CV', designation_type: 'secondary', first_name: 'Juvenal', last_name: 'Carvalho', email: 'jovycarvalho@gmail.com', phone: '935111199', organization: 'Ministry of Digital Economy', job_title: 'Adviser' },
  // 9. Liberia
  { country_code: 'LR', designation_type: 'primary', first_name: 'James', last_name: 'Lynch Monbo', email: 'jmonbo.monbo@gmail.com', phone: '777200001', organization: 'UAF Liberia', job_title: 'Project Coordinator' },
  { country_code: 'LR', designation_type: 'secondary', first_name: 'Elijah', last_name: 'G. Glay', email: 'gondaa577@gmail.com', phone: '770450250', organization: 'UAF Liberia', job_title: 'UAF Coordinator' },
  // 10. Gabon
  { country_code: 'GA', designation_type: 'primary', first_name: 'Lauriane Cephora', last_name: 'Sanou Ebinda', email: 'lauriane.sanou@arcep.ga', phone: '77955244', organization: 'ARCEP Gabon', job_title: null },
  { country_code: 'GA', designation_type: 'secondary', first_name: 'Farid Nazare', last_name: 'BAMBA', email: 'farid.bamba@arcep.ga', phone: '65514320', organization: 'ARCEP Gabon', job_title: null },
  { country_code: 'GA', designation_type: 'secondary', first_name: 'Kassa', last_name: 'Patrick', email: 'patrick.kassadoukaga@arcep.ga', phone: null, organization: 'ARCEP Gabon', job_title: null },
  // 11. Zimbabwe
  { country_code: 'ZW', designation_type: 'primary', first_name: 'Kennedy', last_name: 'Dewera', email: 'dewera@potraz.zw', phone: '41766670249', organization: 'POTRAZ', job_title: 'Director, Universal Service Fund (USF), Postal and Courier Services' },
  { country_code: 'ZW', designation_type: 'secondary', first_name: 'Remember', last_name: 'Muchechemera', email: 'muchechemera@potraz.zw', phone: '776166309', organization: 'POTRAZ', job_title: 'Manager Universal Service Fund' },
  // 12. Mauritania
  { country_code: 'MR', designation_type: 'primary', first_name: 'Salahdine', last_name: 'SOUHEIB', email: 'souheib@are.mr', phone: '36155561', organization: 'ARE', job_title: 'Chef Département Accès Universel, Licences & Autorisations' },
  { country_code: 'MR', designation_type: 'secondary', first_name: 'Nine', last_name: 'Ahmed Abdellahi', email: 'nine.abdalla@are.mr', phone: '41021510', organization: 'ARE', job_title: 'Chef Service Planification Accès Universel' },
  // 13. Uganda
  { country_code: 'UG', designation_type: 'primary', first_name: 'Susan', last_name: 'Nakanwagi', email: 'snakanwagi@ucc.co.ug', phone: '777912005', organization: 'UCUSAF/UCC', job_title: 'Manager Projects & Partnerships' },
  { country_code: 'UG', designation_type: 'secondary', first_name: 'James', last_name: 'Mpango', email: 'jmpango@ucc.co.ug', phone: '782031066', organization: 'UCUSAF/UCC', job_title: 'Manager Monitoring and Evaluation' },
  // 14. Morocco
  { country_code: 'MA', designation_type: 'primary', first_name: 'Abdelkarim', last_name: 'BELKHADIR', email: 'FSU-UAT@anrt.ma', phone: '700025256', organization: 'ANRT', job_title: 'Head of the Universal Service Division' },
  { country_code: 'MA', designation_type: 'secondary', first_name: 'Abdelhay', last_name: 'MOTIAA', email: 'FSU-UAT@anrt.ma', phone: '700025247', organization: 'ANRT', job_title: 'Head of the Universal Service Programme Development Unit' },
  // 15. Kenya
  { country_code: 'KE', designation_type: 'primary', first_name: 'Miriam', last_name: 'Mutuku', email: 'mmutuku@ca.go.ke', phone: '701512661', organization: 'CA Kenya', job_title: null },
  { country_code: 'KE', designation_type: 'secondary', first_name: 'Julius', last_name: 'Lenaseiyan', email: 'lenaseiyan@ca.go.ke', phone: '729617678', organization: 'CA Kenya', job_title: null },
  // 16. Burkina Faso
  { country_code: 'BF', designation_type: 'primary', first_name: 'Sanou', last_name: 'Soumanan', email: 'soumanan.sanou@arcep.bf', phone: '70148281', organization: 'ARCEP Burkina Faso', job_title: 'Chef du département Service Universel' },
  { country_code: 'BF', designation_type: 'secondary', first_name: 'Nikiema', last_name: 'Zakaria', email: 'zakaria.nikiema@arcep.bf', phone: '60317228', organization: 'ARCEP Burkina Faso', job_title: 'Chef du service suivi technique du service universel' },
  // 17. Guinea
  { country_code: 'GN', designation_type: 'primary', first_name: 'Nabe', last_name: 'Aboubacar Sidiki', email: 'aboubacar.nabe@ansuten.gov.gn', phone: '624080828', organization: 'ANSUTEN', job_title: null },
  // 18. Gambia
  { country_code: 'GM', designation_type: 'primary', first_name: 'Serign Modou', last_name: 'Bah', email: 'smbah@mocde.gov.gm', phone: '3733373', organization: 'MOCDE', job_title: 'Director of Post and Telecom' },
  { country_code: 'GM', designation_type: 'secondary', first_name: 'Lamin', last_name: 'Fatty', email: 'lstfatty@mocde.gov.gm', phone: '9017197', organization: 'MOCDE', job_title: 'Principal Telecommunication Officer' },
  // 19. Burundi
  { country_code: 'BI', designation_type: 'primary', first_name: 'Ahiboneye', last_name: 'Elias', email: 'elias.ahiboneye@fsu.gov.bi', phone: '69526514', organization: 'FSU des TIC', job_title: 'Directeur du FSU des TIC' },
  { country_code: 'BI', designation_type: 'secondary', first_name: 'Kayeye', last_name: 'Milca Ornella', email: 'milca-ornella.kayeye@fsu.gov.bi', phone: '71306294', organization: 'FSU des TIC', job_title: 'Expert en TIC au FSU' },
  // 20. Central African Republic
  { country_code: 'CF', designation_type: 'primary', first_name: 'Dieu Béni', last_name: 'DAZOUROU', email: 'steve.dazourou@arcep.cf', phone: '72024949', organization: 'ARCEP Centrafrique', job_title: 'Chef de Service Chargé de la Protection des Consommateurs et de la Gestion des Services Universels' },
  { country_code: 'CF', designation_type: 'secondary', first_name: 'Elysée', last_name: 'SOKOTE', email: 'elysee.sokote@arcep.cf', phone: '72019797', organization: 'ARCEP Centrafrique', job_title: 'Chef de Service Réseaux, Infrastructures et Qualité des Services' },
  // 21. Tanzania
  { country_code: 'TZ', designation_type: 'primary', first_name: 'Batholomew Marcel', last_name: 'Waranse', email: 'batholomew.marcel@tcra.go.tz', phone: '713056859', organization: 'TCRA', job_title: 'Statistician' },
  { country_code: 'TZ', designation_type: 'secondary', first_name: 'Peter John', last_name: 'Mushi', email: 'peter.mushi@ucsaf.go.tz', phone: '712104200', organization: 'UCSAF', job_title: 'Statistician' },
  // 22. Mauritius
  { country_code: 'MU', designation_type: 'primary', first_name: 'Harish', last_name: 'BHOOLAH', email: 'hbhoolah@icta.mu', phone: '52545940', organization: 'ICTA', job_title: 'Director of Finance & Administration' },
  { country_code: 'MU', designation_type: 'secondary', first_name: 'Shenabadi', last_name: 'RAMASAMY', email: 'sramasamy@icta.mu', phone: '52531252', organization: 'ICTA', job_title: 'USF Project Coordinator' },
  // 23. Mali
  { country_code: 'ML', designation_type: 'primary', first_name: 'Camara', last_name: 'Issa', email: 'icamara@amrtp.ml', phone: '76304009', organization: 'AMRTP', job_title: 'Head of the Universal Access Service' },
  { country_code: 'ML', designation_type: 'secondary', first_name: 'Doumbia', last_name: 'Ibrahim', email: 'idoumbia@agefau.ml', phone: '66821836', organization: 'AGEFAU', job_title: 'Director of Universal Access Infrastructure Development Projects' },
  // 24. Angola
  { country_code: 'AO', designation_type: 'primary', first_name: 'Pedro José', last_name: 'Manuel', email: 'pedro.manuel@minttics.gov.ao', phone: '923734246', organization: 'MINTTICS', job_title: 'Director of the Legal Office' },
  { country_code: 'AO', designation_type: 'secondary', first_name: 'José Cristovão', last_name: 'Quiombo', email: 'jose.quiombo@minttics.gov.ao', phone: '924092282', organization: 'MINTTICS', job_title: 'Head of Department of the National Directorate' },
  // 25. Chad
  { country_code: 'TD', designation_type: 'primary', first_name: 'Kadidja Harsou', last_name: 'Abbas', email: 'kadidjaharsouabbas@gmail.com', phone: '783779810', organization: 'ADETIC', job_title: 'Directrice du Service Universel et du Suivi des Travaux' },
  { country_code: 'TD', designation_type: 'secondary', first_name: 'Zakaria Yamouda', last_name: 'Djorbo', email: 'ibnyamoudabendjorbo13@gmail.com', phone: '62707070', organization: 'ADETIC', job_title: 'Chef de Service Universel des Communications Électroniques et des Postes' },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const userId = claimsData.claims.sub as string

    // Check admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (!profile || !['super_admin', 'country_admin', 'editor'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Step 1: Insert missing countries
    const { error: countriesError } = await supabaseAdmin
      .from('countries')
      .upsert(MISSING_COUNTRIES, { onConflict: 'code', ignoreDuplicates: true })

    if (countriesError) {
      console.error('Countries insert error:', countriesError)
      return new Response(JSON.stringify({ error: 'Failed to insert countries', details: countriesError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Step 2: Insert focal points
    const focalPointsToInsert = FOCAL_POINTS.map(fp => ({
      ...fp,
      phone: cleanPhone(fp.phone),
      status: 'pending',
      created_by: userId,
    }))

    const { data: inserted, error: fpError } = await supabaseAdmin
      .from('focal_points')
      .insert(focalPointsToInsert)
      .select('id')

    if (fpError) {
      console.error('Focal points insert error:', fpError)
      return new Response(JSON.stringify({ error: 'Failed to insert focal points', details: fpError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({
      success: true,
      countries_added: MISSING_COUNTRIES.length,
      focal_points_added: inserted?.length ?? 0,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Import error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
