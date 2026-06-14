import { DataSource } from 'typeorm';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { Service } from '../modules/services/entities/service.entity';
import { Case } from '../modules/cases/entities/case.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'ai_platform',
    entities: [User, Service, Case],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('📦 Database connected');

  const userRepository = dataSource.getRepository(User);
  const serviceRepository = dataSource.getRepository(Service);
  const caseRepository = dataSource.getRepository(Case);

  // Create admin user with real bcrypt hash
  const adminUser = await userRepository.findOne({
    where: { email: 'admin@aiplatform.com' },
  });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      email: 'admin@aiplatform.com',
      password: hashedPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    });
    console.log('✅ Admin user created (admin@aiplatform.com / admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create services
  const existingServices = await serviceRepository.count();
  if (existingServices === 0) {
    await serviceRepository.save([
      {
        title: 'Chatbots Inteligentes',
        description: 'Asistentes virtuales que entienden contexto, resuelven consultas 24/7 y mejoran la experiencia del cliente.',
        icon: 'MessageSquare',
        features: ['NLP avanzado', 'Multi-idioma', 'Integración CRM', 'Aprendizaje continuo'],
        useCases: ['Atención al cliente', 'Soporte técnico', 'Ventas y cotizaciones', 'Onboarding'],
        sortOrder: 1,
      },
      {
        title: 'Automatización de Procesos',
        description: 'Elimina tareas repetitivas y optimiza flujos de trabajo con RPA e IA inteligente.',
        icon: 'Workflow',
        features: ['RPA', 'Flujos personalizados', 'Reportes automáticos', 'Escalabilidad'],
        useCases: ['Procesamiento de facturas', 'Gestión de inventario', 'Reportes financieros', 'Onboarding de empleados'],
        sortOrder: 2,
      },
      {
        title: 'Agentes Autónomos',
        description: 'Agentes de IA que toman decisiones, ejecutan tareas complejas y aprenden de cada interacción.',
        icon: 'Bot',
        features: ['Toma de decisiones', 'Acciones autónomas', 'Multi-agente', 'Monitoreo'],
        useCases: ['Gestión de cadena de suministro', 'Optimización de precios', 'Análisis de mercado', 'Automatización de cobranza'],
        sortOrder: 3,
      },
    ]);
    console.log('✅ Services seeded');
  } else {
    console.log('ℹ️  Services already exist');
  }

  // Create sample cases
  const existingCases = await caseRepository.count();
  if (existingCases === 0) {
    await caseRepository.save([
      {
        title: 'Chatbot para TechCorp MX',
        description: 'Implementamos un chatbot que redujo las consultas un 70% y mejoró la satisfacción del cliente.',
        clientName: 'Laura Martínez',
        clientCompany: 'TechCorp MX',
        results: ['70% reducción en consultas', '95% satisfacción del cliente', 'ROI en 3 meses'],
        industry: 'Tecnología',
      },
      {
        title: 'Automatización para InnovateLab',
        description: 'Automatizamos procesos manuales que ahorraron miles de horas al año.',
        clientName: 'Miguel Ángel Rivera',
        clientCompany: 'InnovateLab',
        results: ['10,000 horas ahorradas al año', '60% reducción de costos', 'Procesos 100% automatizados'],
        industry: 'Manufactura',
      },
    ]);
    console.log('✅ Cases seeded');
  } else {
    console.log('ℹ️  Cases already exist');
  }

  await dataSource.destroy();
  console.log('🎉 Seed completed');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
