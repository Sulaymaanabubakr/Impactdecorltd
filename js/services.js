// Services Page JavaScript

const serviceModal = document.getElementById('serviceModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.querySelector('.modal-close');

const serviceDetails = {
    construction: {
        title: 'Construction Services',
        content: `
            <h2>Construction Services</h2>
            <p>Our construction services encompass every aspect of building projects, from initial planning to final completion. We pride ourselves on delivering high-quality construction work that meets and exceeds industry standards.</p>
            
            <h3>What We Offer</h3>
            <ul>
                <li><strong>New Builds:</strong> Complete construction of new residential and commercial properties</li>
                <li><strong>Extensions:</strong> Home and commercial property extensions to maximize your space</li>
                <li><strong>Structural Work:</strong> Expert structural alterations and modifications</li>
                <li><strong>Foundation Work:</strong> Solid groundwork and foundation services</li>
                <li><strong>Roofing:</strong> Complete roofing solutions from installation to repairs</li>
                <li><strong>Project Management:</strong> Full coordination and oversight of construction projects</li>
            </ul>
            
            <h3>Our Approach</h3>
            <p>We work closely with architects, engineers, and clients to ensure every project is completed to the highest standards. Our experienced team uses modern construction techniques while maintaining traditional craftsmanship.</p>
            
            <p>All work is carried out in compliance with UK Building Regulations and health and safety standards.</p>
        `
    },
    refurbishment: {
        title: 'Refurbishment Services',
        content: `
            <h2>Refurbishment Services</h2>
            <p>Transform your property with our comprehensive refurbishment services. Whether it's a single room or an entire building, we bring new life to existing spaces.</p>
            
            <h3>Specializations</h3>
            <ul>
                <li><strong>Full Property Renovation:</strong> Complete property transformations</li>
                <li><strong>Kitchen Refurbishment:</strong> Modern kitchen designs and installations</li>
                <li><strong>Bathroom Renovation:</strong> Luxury bathroom upgrades</li>
                <li><strong>Period Property Restoration:</strong> Sympathetic restoration of historic buildings</li>
                <li><strong>Commercial Refurbishment:</strong> Office and retail space upgrades</li>
                <li><strong>Energy Efficiency:</strong> Improvements to reduce energy consumption</li>
            </ul>
            
            <h3>Quality Assured</h3>
            <p>We use only premium materials and employ skilled craftspeople to ensure your refurbishment project exceeds expectations. Our attention to detail ensures a flawless finish.</p>
        `
    },
    painting: {
        title: 'Painting & Decorating',
        content: `
            <h2>Painting & Decorating Services</h2>
            <p>Professional painting and decorating services that transform interiors and exteriors with precision and care.</p>
            
            <h3>Our Services Include</h3>
            <ul>
                <li><strong>Interior Painting:</strong> Walls, ceilings, woodwork, and more</li>
                <li><strong>Exterior Painting:</strong> Weather-resistant coatings for lasting protection</li>
                <li><strong>Wallpaper Installation:</strong> Expert hanging of all wallpaper types</li>
                <li><strong>Decorative Finishes:</strong> Specialist techniques and effects</li>
                <li><strong>Commercial Painting:</strong> Large-scale projects for businesses</li>
                <li><strong>Surface Preparation:</strong> Thorough prep work for perfect results</li>
            </ul>
            
            <h3>Premium Materials</h3>
            <p>We use high-quality paints and materials from trusted brands, ensuring durability and a beautiful finish. Eco-friendly options are available upon request.</p>
        `
    },
    interior: {
        title: 'Interior Design',
        content: `
            <h2>Interior Design Services</h2>
            <p>Create stunning spaces that reflect your personality and meet your practical needs with our bespoke interior design services.</p>
            
            <h3>Design Services</h3>
            <ul>
                <li><strong>Space Planning:</strong> Optimize your layout for functionality and flow</li>
                <li><strong>Colour Consultation:</strong> Expert advice on colour schemes and palettes</li>
                <li><strong>Furniture Selection:</strong> Sourcing and specification of furniture and furnishings</li>
                <li><strong>Lighting Design:</strong> Create the perfect ambiance with strategic lighting</li>
                <li><strong>Bespoke Joinery:</strong> Custom-built furniture and storage solutions</li>
                <li><strong>3D Visualization:</strong> See your space before work begins</li>
            </ul>
            
            <h3>Collaborative Process</h3>
            <p>We work closely with you to understand your vision and requirements, creating designs that are both beautiful and practical.</p>
        `
    },
    management: {
        title: 'Project Management',
        content: `
            <h2>Project Management Services</h2>
            <p>Professional project management ensures your construction project runs smoothly from start to finish.</p>
            
            <h3>Management Services</h3>
            <ul>
                <li><strong>Project Planning:</strong> Detailed planning and scheduling</li>
                <li><strong>Budget Control:</strong> Cost management and financial oversight</li>
                <li><strong>Contractor Coordination:</strong> Managing all trades and suppliers</li>
                <li><strong>Quality Control:</strong> Regular inspections and quality assurance</li>
                <li><strong>Progress Reporting:</strong> Regular updates on project status</li>
                <li><strong>Health & Safety:</strong> Full HSE compliance and management</li>
            </ul>
            
            <h3>Peace of Mind</h3>
            <p>With our project management services, you can relax knowing that your project is in capable hands. We handle all the details so you don't have to.</p>
        `
    },
    maintenance: {
        title: 'Property Maintenance',
        content: `
            <h2>Property Maintenance Services</h2>
            <p>Keep your property in excellent condition with our comprehensive maintenance services.</p>
            
            <h3>Maintenance Solutions</h3>
            <ul>
                <li><strong>Routine Maintenance:</strong> Regular property inspections and upkeep</li>
                <li><strong>Emergency Repairs:</strong> 24/7 callout for urgent issues</li>
                <li><strong>Plumbing Services:</strong> All plumbing repairs and installations</li>
                <li><strong>Electrical Work:</strong> Qualified electricians for all electrical needs</li>
                <li><strong>Seasonal Care:</strong> Preparation for winter and summer conditions</li>
                <li><strong>Multi-Property Management:</strong> Services for landlords and property managers</li>
            </ul>
            
            <h3>Reliable Service</h3>
            <p>Our maintenance team is experienced, reliable, and committed to keeping your property in top condition. We offer flexible service agreements to suit your needs.</p>
        `
    }
};

function openServiceModal(serviceType) {
    const service = serviceDetails[serviceType];
    if (service && modalContent) {
        modalContent.innerHTML = service.content;
        serviceModal.classList.add('active');
        serviceModal.style.display = 'flex';
    }
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        serviceModal.classList.remove('active');
        serviceModal.style.display = 'none';
    });
}

if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            serviceModal.classList.remove('active');
            serviceModal.style.display = 'none';
        }
    });
}

// Make openServiceModal available globally
window.openServiceModal = openServiceModal;
