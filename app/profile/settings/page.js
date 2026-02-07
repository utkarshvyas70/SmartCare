'use client';

import React, { useState, useRef } from 'react';
import { useUser } from '@/app/hooks/useUser';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '@/app/actions/profile';

import {
  HiOutlineCamera, HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar,
  HiOutlineLocationMarker, HiOutlineSparkles, HiOutlineBriefcase, HiOutlineAcademicCap,
  HiOutlineUpload, HiOutlineExclamation, HiOutlineTrash, HiPlus, HiX, HiCheckCircle
} from 'react-icons/hi';
import { FaVenusMars, FaTint, FaAllergies, FaPlusCircle } from 'react-icons/fa';

function FormSection({ title, description, children }) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}



function TagInput({ items, setItems, placeholder }) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
  
    const handleKeyDown = (e) => {
      // Add tag on Enter or Comma
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (newTag && !items.includes(newTag)) {
          setItems([...items, newTag]);
        }
        setInputValue('');
      }
      // Remove last tag on backspace if input is empty
      else if (e.key === 'Backspace' && inputValue === '' && items.length > 0) {
        setItems(items.slice(0, -1));
      }
    };
  
    const removeItem = (itemToRemove) => {
      setItems(items.filter(item => item !== itemToRemove));
    };
  
    return (
      <div>
        <div 
          className={`flex flex-wrap items-center gap-2 p-2 bg-white border border-slate-300 rounded-lg shadow-sm transition-all duration-200 ${
            isFocused ? 'ring-2 ring-emerald-500 border-emerald-500' : 'hover:border-slate-400'
          }`}
        >
          {items.map(item => (
            <div key={item} className="flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-semibold pl-3 pr-2 py-1 rounded-full">
              <span>{item}</span>
              <button 
                type="button" 
                onClick={() => removeItem(item)}
                className="p-0.5 rounded-full text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={items.length > 0 ? '' : placeholder}
            className="flex-grow bg-transparent outline-none p-1 text-sm text-slate-800"
          />
        </div>
         <p className="text-xs text-slate-500 mt-2">Type and press Enter or Comma to add an item.</p>
      </div>
    );
  }




// An interactive component for handling image uploads with previews.
function ImageUploader({ label, defaultImage, onFileChange }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file); // Lift the file object up for the form submission
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentImage = preview || defaultImage;
  const letter = (label?.[0] || 'U').toUpperCase();

  return (
    <div className="flex items-center gap-6">
      {currentImage ? (
        <Image
          src={currentImage}
          alt="Profile preview"
          width={96}
          height={96}
          className="rounded-full object-cover w-24 h-24 border-4 border-white shadow-sm"
        />
      ) : (
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-4xl font-bold">
          {letter}
        </div>
      )}
      <div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
        >
          <HiOutlineUpload /> Change Photo
        </button>
        <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
      </div>
    </div>
  );
}


function FormSubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending} className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow disabled:bg-gray-400 disabled:cursor-not-allowed">
        {pending ? 'Saving...' : 'Save All Changes'}
      </button>
    );
}


// --- Main Settings Page ---
export default function SettingsPage() {
  const { user, loading } = useUser();


  if (loading || !user) {
    return <div className="animate-pulse h-screen bg-white rounded-xl shadow-sm"></div>;
  }
  
  // This server action would handle the form submission
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Profile Settings</h2>
        <p className="mt-1 text-slate-500">Keep your personal and professional information up to date.</p>
      </div>
      
      {user.role === 'patient' ? <PatientSettingsForm user={user} /> : <DoctorSettingsForm user={user} />}
    </div>
  );

}





// --- Patient-Specific Settings Form ---
function PatientSettingsForm({ user }) {
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);

    const [habits, setHabits] = useState(user.lifestyle_habits || { smoking: '', alcohol: '', exercise: '' });
    const handleHabitChange = (field, value) => setHabits(prev => ({ ...prev, [field]: value }));

    const [state, formAction] = useFormState(updateProfile, { success: false, message: null });

    const handleFormSubmit = (formData) => {
        if (profilePhotoFile) {
          formData.append('profile_photo_file', profilePhotoFile);
        }
        formAction(formData);
      };

  return (
    <form action={handleFormSubmit} className="space-y-8 mt-8">
      {/* --- Personal Information Section --- */}
      <FormSection title="Personal Information" description="Your basic profile details. This information will be visible to your doctors.">
        <div className="sm:col-span-2">
          <ImageUploader label={user.patient_name} defaultImage={user.profile_photo_url} onFileChange={setProfilePhotoFile} />
        </div>
        <div>
          <label htmlFor="patient_name" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input type="text" id="patient_name" name="patient_name" defaultValue={user.patient_name || ''} className="mt-1 form-input" />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">Phone Number</label>
          <input type="tel" id="phone_number" name="phone_number" defaultValue={user.phone_number || ''} className="mt-1 form-input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
          <input type="email" id="email" value={user.email} disabled className="mt-1 form-input-disabled" />
        </div>
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700">Date of Birth</label>
          <input type="date" id="date_of_birth" name="date_of_birth" defaultValue={user.date_of_birth || ''} className="mt-1 form-input" />
        </div>
         <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Gender</label>
          <select id="gender" name="gender" defaultValue={user.gender || ''} className="mt-1 form-input">
            <option>Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
          </select>
        </div>
      </FormSection>


      <FormSection title="Address" description="Your primary residential address.">
         <div className="sm:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-slate-700">Street Address</label>
            <input type="text" name="street" id="street" defaultValue={user.address?.street || ''} className="mt-1 form-input"/>
        </div>
        <div>
            <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
            <input type="text" name="city" id="city" defaultValue={user.address?.city || ''} className="mt-1 form-input"/>
        </div>
        <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-700">State / Province</label>
            <input type="text" name="state" id="state" defaultValue={user.address?.state || ''} className="mt-1 form-input"/>
        </div>
      </FormSection>


      {/* --- Medical Information Section --- */}
      <FormSection title="Medical Information" description="This critical information helps provide a more accurate diagnosis.">
        <div>
          <label htmlFor="blood_group" className="block text-sm font-medium text-slate-700">Blood Group</label>
          <select id="blood_group" name="blood_group" defaultValue={user.blood_group || ''} className="mt-1 form-input">
            <option value="">Select...</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
          </select>
        </div>
        <div>
          <label htmlFor="height_cm" className="block text-sm font-medium text-slate-700">Height (cm)</label>
          <input type="number" id="height_cm" name="height_cm" defaultValue={user.height_cm || ''} className="mt-1 form-input" />
        </div>
        <div>
          <label htmlFor="weight_kg" className="block text-sm font-medium text-slate-700">Weight (kg)</label>
          <input type="number" step="0.1" id="weight_kg" name="weight_kg" defaultValue={user.weight_kg || ''} className="mt-1 form-input" />
        </div>
        <div className="sm:col-span-2">
           <label htmlFor="allergies" className="block text-sm font-medium text-slate-700">Known Allergies</label>
           <input type="text" id="allergies" name="allergies" defaultValue={user.allergies?.join(', ') || ''} className="mt-1 form-input" placeholder="e.g. Peanuts, Penicillin, Pollen"/>
           <p className="text-xs text-slate-400 mt-1">Please separate items with a comma.</p>
        </div>
        <div className="sm:col-span-2">
           <label htmlFor="chronic_conditions" className="block text-sm font-medium text-slate-700">Chronic Conditions</label>
           <input type="text" id="chronic_conditions" name="chronic_conditions" defaultValue={user.chronic_conditions?.join(', ') || ''} className="mt-1 form-input" placeholder="e.g. Hypertension, Asthma"/>
           <p className="text-xs text-slate-400 mt-1">Please separate items with a comma.</p>
        </div>
      </FormSection>

      <FormSection title="Lifestyle Habits" description="Provides valuable context for your doctor.">
        <div className="sm:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Smoking Status</label>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                {['Never', 'Former', 'Current'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-gray-900 text-sm"><input type="radio" name="smoking" value={status} defaultChecked={user.lifestyle_habits?.smoking === status} className="form-radio"/>{status}</label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Alcohol Consumption</label>
              <select name="alcohol" defaultValue={user.lifestyle_habits?.alcohol || ''} className="mt-1 form-input">
                <option value="">Select...</option><option>None</option><option>Socially</option><option>Regularly</option>
              </select>
            </div>
        </div>
      </FormSection>
      
      {/* Save Button */}
      <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-6">
        {state.message && (
          <p className={`text-sm font-semibold ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
        )}
        <FormSubmitButton />
      </div>
    </form>
  );
}





function EducationForm({ education, setEducation }) {
    const addEntry = () => setEducation([...education, { degree: '', school: '', year: '' }]);
    const removeEntry = (index) => setEducation(education.filter((_, i) => i !== index));
    const handleChange = (index, field, value) => {
      const updated = [...education];
      updated[index][field] = value;
      setEducation(updated);
    };
  
    return (
      <div className="space-y-4">
        {education.map((entry, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-7 gap-3 p-4 bg-slate-50 rounded-lg border">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600">Degree</label>
              <input type="text" value={entry.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} className="mt-1 form-input" placeholder="e.g., M.D." />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-600">School/University</label>
              <input type="text" value={entry.school} onChange={(e) => handleChange(index, 'school', e.target.value)} className="mt-1 form-input" placeholder="e.g., Harvard Medical School" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600">Year</label>
              <input type="number" value={entry.year} onChange={(e) => handleChange(index, 'year', e.target.value)} className="mt-1 form-input" placeholder="e.g., 2010" />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={() => removeEntry(index)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addEntry} className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800">
          <HiPlus /> Add Education
        </button>
      </div>
    );
  }







// --- Doctor-Specific Settings Form ---
function DoctorSettingsForm({ user }) {
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [degreePhotoFile, setDegreePhotoFile] = useState(null);

    const [specialties, setSpecialties] = useState(user.specialties || []);
    const [languages, setLanguages] = useState(user.languages_spoken || []);
    const [education, setEducation] = useState(user.education || []);

    const [state, formAction] = useFormState(updateProfile, { success: false, message: null });


    const handleFormSubmit = (formData) => {
        // Add file objects to the FormData
        if (profilePhotoFile) formData.append('profile_photo_file', profilePhotoFile);
        if (degreePhotoFile) formData.append('degree_photo_file', degreePhotoFile);
        
        // Add the stateful, dynamic data as JSON strings so the action can parse them
        formData.append('specialties', JSON.stringify(specialties));
        formData.append('languages_spoken', JSON.stringify(languages));
        formData.append('education', JSON.stringify(education));
    
        formAction(formData);
      };

  return (
    <form action={handleFormSubmit} className="space-y-8 mt-8">
      {/* --- Professional Profile Section --- */}
      <FormSection title="Professional Profile" description="This information will be visible to patients on your public profile.">
        <div className="sm:col-span-2">
          <ImageUploader label={user.doctor_name} defaultImage={user.profile_photo_url} onFileChange={setProfilePhotoFile} />
        </div>
        <div>
          <label htmlFor="doctor_name" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input type="text" id="doctor_name" name="doctor_name" defaultValue={user.doctor_name || ''} className="mt-1 form-input" />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">Practice Phone Number</label>
          <input type="tel" id="phone_number" name="phone_number" defaultValue={user.phone_number || ''} className="mt-1 form-input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="professional_statement" className="block text-sm font-medium text-slate-700">Professional Statement</label>
          <textarea id="professional_statement" name="professional_statement" rows={4} defaultValue={user.professional_statement || ''} className="mt-1 form-input" placeholder="A brief, impactful bio for your profile page..."></textarea>
        </div>
      </FormSection>

      {/* --- Credentials & Verification Section --- */}
      <FormSection title="Credentials & Verification" description="Your qualifications and specialties. This is critical for patient trust.">
        <div className="sm:col-span-2">
          <h4 className="text-base font-semibold text-slate-800 mb-4">Degree Verification</h4>
          <ImageUploader label="Degree Certificate" defaultImage={user.degree_photo_url} onFileChange={setDegreePhotoFile} />
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg flex gap-3">
            <HiOutlineExclamation className="w-5 h-5 flex-shrink-0"/>
            <p>Uploading a clear photo of your degree certificate is required to receive the Verified badge on your profile.</p>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Specialties</label>
          <div className="mt-1"><TagInput items={specialties} setItems={setSpecialties} placeholder="Add a specialty..." /></div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Languages Spoken</label>
          <div className="mt-1"><TagInput items={languages} setItems={setLanguages} placeholder="Add a language..." /></div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-slate-700">Education</label>
          <div className="mt-2"><EducationForm education={education} setEducation={setEducation} /></div>
        </div>
      </FormSection>

      {/* Save Button */}
      <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-6">
         {state.message && (
          <p className={`text-sm font-semibold flex items-center gap-2 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.success && <HiCheckCircle/>}
            {state.message}
          </p>
        )}
        <FormSubmitButton />
      </div>

    </form>
  );
}