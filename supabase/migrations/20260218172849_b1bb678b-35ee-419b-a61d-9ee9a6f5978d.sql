
UPDATE homepage_content_blocks 
SET 
  content_fr = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(content_fr::jsonb, '{title}', '"Ne laisser personne hors ligne"'),
            '{subtitle_suffix}', '"pour connecter les non-connectés"'
          ),
          '{description}', '"Renforcer le service universel pour une connectivité numérique inclusive. Fournir un service universel performant pour réduire la fracture numérique."'
        ),
        '{cta_explore}', '"Explorer le réseau"'
      ),
      '{cta_signup}', '"S''inscrire"'
    ),
    '{cta_login}', '"Se connecter"'
  ),
  content_en = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(content_en::jsonb, '{title}', '"Leave no one offline"'),
            '{subtitle_suffix}', '"to connect the unconnected"'
          ),
          '{description}', '"Strengthening universal service for inclusive digital connectivity. Providing effective universal service to bridge the digital divide."'
        ),
        '{cta_explore}', '"Explore the network"'
      ),
      '{cta_signup}', '"Sign up"'
    ),
    '{cta_login}', '"Log in"'
  ),
  content_ar = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(content_ar::jsonb, '{title}', '"لا تترك أحداً بلا اتصال"'),
            '{subtitle_suffix}', '"لربط غير المتصلين"'
          ),
          '{description}', '"تعزيز الخدمة الشاملة من أجل اتصال رقمي شامل. تقديم خدمة شاملة فعالة لسد الفجوة الرقمية."'
        ),
        '{cta_explore}', '"استكشاف الشبكة"'
      ),
      '{cta_signup}', '"إنشاء حساب"'
    ),
    '{cta_login}', '"تسجيل الدخول"'
  ),
  content_pt = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(content_pt::jsonb, '{title}', '"Não deixar ninguém offline"'),
            '{subtitle_suffix}', '"para conectar os não conectados"'
          ),
          '{description}', '"Reforçar o serviço universal para uma conectividade digital inclusiva. Fornecer um serviço universal eficaz para reduzir a fratura digital."'
        ),
        '{cta_explore}', '"Explorar a rede"'
      ),
      '{cta_signup}', '"Registar-se"'
    ),
    '{cta_login}', '"Entrar"'
  )
WHERE block_key = 'hero';
